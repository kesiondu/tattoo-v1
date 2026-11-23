import { persistRemoteImage } from '@/server/tattoo/storage';
import { and, eq, inArray, lt } from 'drizzle-orm';

import { AIMediaType, KieProvider } from '@/core/ai';
import { db } from '@/core/db';
import { aiTask } from '@/config/db/schema';
import { TATTOO_TASK_SCENE } from '@/config/tattoo-credits';
import {
  AITaskStatus,
  findTask,
  getTasks,
  updateTask,
} from '@/modules/ai-tasks/service';
import { getAllConfigs } from '@/modules/config/service';

export { TATTOO_TASK_SCENE };

export const TATTOO_TASK_STALE_MS = 30 * 60 * 1000;

export interface TattooTaskView {
  id: string;
  status: string;
  tier: string;
  model: string;
  modelLabel: string;
  prompt: string;
  imageUrl: string | null;
  hasArtwork: boolean;
  error: string | null;
  artworkError: string | null;
  stage: string | null;
  costCredits: number;
  createdAt: Date;
}

type StoredTaskResult = {
  imageUrl?: string | null;
  images?: { imageUrl?: string | null }[];
  tier?: string;
  modelLabel?: string;
  error?: string;
  storageKey?: string;
  contentType?: string;
  artworkUrl?: string;
  artworkStorageKey?: string;
  artworkContentType?: string;
  artworkError?: string;
  stage?: 'artwork' | 'body' | 'body_preview' | 'stencil_extraction' | 'done';
};

function parseJson(value: unknown): any {
  if (typeof value !== 'string' || !value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function parseOptions(value: unknown): {
  tier?: string;
  modelLabel?: string;
  userPrompt?: string;
  bodyPrompt?: string;
  stencilPrompt?: string;
  bodyReferenceUrl?: string;
} {
  return parseJson(value) ?? {};
}

function parseResult(value: unknown): StoredTaskResult {
  return parseJson(value) ?? {};
}

export function toTaskView(row: any): TattooTaskView {
  const result = parseResult(row.taskResult);
  const options = parseOptions(row.options);
  return {
    id: row.id,
    status: row.status,
    tier: result.tier || options.tier || 'fast_body_preview',
    model: row.model,
    modelLabel: result.modelLabel || options.modelLabel || row.model,
    prompt: options.userPrompt || row.prompt,
    imageUrl: result.imageUrl || result.images?.[0]?.imageUrl || null,
    hasArtwork: Boolean(result.artworkStorageKey),
    error: result.error || null,
    artworkError: result.artworkError || null,
    stage: result.stage || null,
    costCredits: row.costCredits || 0,
    createdAt: row.createdAt,
  };
}

/**
 * Lazily close tasks whose provider call never settled (for example the
 * server crashed after charging). updateTask() refunds exactly once.
 */
async function closeIfStale(row: any) {
  if (
    !row ||
    (row.status !== AITaskStatus.PENDING &&
      row.status !== AITaskStatus.PROCESSING)
  ) {
    return;
  }
  const updatedAt = row.updatedAt ? new Date(row.updatedAt).getTime() : 0;
  if (Date.now() - updatedAt < TATTOO_TASK_STALE_MS) return;
  await updateTask({
    taskId: row.id,
    status: AITaskStatus.FAILED,
    taskResult: { error: 'Generation timed out; credits were refunded.' },
  });
}

async function failStaleTattooTasks(userId: string) {
  const cutoff = new Date(Date.now() - TATTOO_TASK_STALE_MS);
  const rows = await db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.userId, userId),
        eq(aiTask.scene, TATTOO_TASK_SCENE),
        inArray(aiTask.status, [AITaskStatus.PENDING, AITaskStatus.PROCESSING]),
        lt(aiTask.updatedAt, cutoff)
      )
    )
    .limit(10);

  await Promise.all(
    rows.map((row: any) =>
      updateTask({
        taskId: row.id,
        status: AITaskStatus.FAILED,
        taskResult: {
          error: 'Generation timed out; credits were refunded.',
        },
      }).catch((error) => {
        console.error('failed to close stale tattoo task:', error);
      })
    )
  );
}

export async function listTattooTasks(userId: string, limit = 50) {
  await failStaleTattooTasks(userId);

  const rows = await getTasks({
    userId,
    mediaType: AIMediaType.IMAGE,
    scene: TATTOO_TASK_SCENE,
    limit,
  });

  // Keep the list usable for asynchronous providers: refresh the newest few
  // in-flight tasks instead of leaving them "processing" forever.
  const pending = rows
    .filter(
      (row: any) =>
        row.provider === 'kie' &&
        (row.status === AITaskStatus.PENDING ||
          row.status === AITaskStatus.PROCESSING) &&
        row.taskId
    )
    .slice(0, 10);
  if (pending.length > 0) {
    await Promise.all(
      pending.map((row: any) => refreshKieTask(row).catch(() => undefined))
    );
    const refreshed = await getTasks({
      userId,
      mediaType: AIMediaType.IMAGE,
      scene: TATTOO_TASK_SCENE,
      limit,
    });
    return refreshed.map(toTaskView);
  }

  return rows.map(toTaskView);
}

async function refreshKieTask(row: any): Promise<void> {
  if (!row.taskId) {
    await updateTask({
      taskId: row.id,
      status: AITaskStatus.FAILED,
      taskResult: { error: 'The AI provider did not return a task id' },
    });
    return;
  }

  const configs = await getAllConfigs();
  const kieApiKey =
    configs.kie_api_key?.trim() || process.env.KIE_API_KEY || '';
  if (!kieApiKey) {
    await updateTask({
      taskId: row.id,
      status: AITaskStatus.FAILED,
      taskResult: { error: 'AI provider is not configured' },
    });
    return;
  }

  const kie = new KieProvider({ apiKey: kieApiKey });
  const res = await kie.query({
    taskId: row.taskId,
    mediaType: AIMediaType.IMAGE,
  });

  const providerImageUrl = res.taskInfo?.images?.[0]?.imageUrl ?? null;
  const options = parseOptions(row.options);
  const previousResult = parseResult(row.taskResult);

  if (res.taskStatus === AITaskStatus.SUCCESS) {
    if (!providerImageUrl) {
      await updateTask({
        taskId: row.id,
        status: AITaskStatus.FAILED,
        taskResult: { error: 'The AI provider returned no image' },
      });
      return;
    }

    // Kie result URLs expire. Copy the image into our storage before marking
    // the task successful so /my-designs does not rot.
    const storedImage = await persistRemoteImage(providerImageUrl, row.id);
    await updateTask({
      taskId: row.id,
      status: AITaskStatus.SUCCESS,
      // Compact summary only; taskResult already holds the image URL.
      taskInfo: { status: AITaskStatus.SUCCESS },
      taskResult: {
        imageUrl: storedImage.url,
        storageKey: storedImage.storageKey,
        contentType: storedImage.contentType,
        tier: options.tier,
        modelLabel: options.modelLabel,
        providerStatus: res.taskStatus,
        artworkUrl: previousResult.artworkUrl,
        artworkStorageKey: previousResult.artworkStorageKey,
        artworkContentType: previousResult.artworkContentType,
        stage: 'done',
      },
    });
    return;
  }

  if (res.taskStatus === AITaskStatus.FAILED) {
    await updateTask({
      taskId: row.id,
      status: AITaskStatus.FAILED,
      taskResult: {
        error:
          res.taskInfo?.errorMessage ||
          res.taskInfo?.errorCode ||
          'AI generation failed',
        tier: options.tier,
      },
    });
    return;
  }

  // Still queued/generating: persist the provider task id if it was missing.
  if (row.status === AITaskStatus.PENDING) {
    await updateTask({
      taskId: row.id,
      status: AITaskStatus.PROCESSING,
      providerTaskId: row.taskId,
    });
  }
}

export async function getTattooTaskStorage(
  userId: string,
  taskId: string
): Promise<{ storageKey: string; contentType: string } | null> {
  const row = await findTask(taskId);
  if (
    !row ||
    row.userId !== userId ||
    row.scene !== TATTOO_TASK_SCENE ||
    row.deletedAt ||
    row.status !== AITaskStatus.SUCCESS
  ) {
    return null;
  }
  const result = parseResult(row.taskResult);
  if (!result.storageKey) return null;
  return {
    storageKey: result.storageKey,
    contentType: result.contentType || 'image/png',
  };
}

export async function getTattooTaskArtworkStorage(
  userId: string,
  taskId: string
): Promise<{ storageKey: string; contentType: string } | null> {
  const row = await findTask(taskId);
  if (
    !row ||
    row.userId !== userId ||
    row.scene !== TATTOO_TASK_SCENE ||
    row.deletedAt ||
    row.status !== AITaskStatus.SUCCESS
  ) {
    return null;
  }
  const result = parseResult(row.taskResult);
  if (!result.artworkStorageKey) return null;
  return {
    storageKey: result.artworkStorageKey,
    contentType: result.artworkContentType || 'image/png',
  };
}

export async function getTattooTask(
  userId: string,
  taskId: string
): Promise<TattooTaskView | null> {
  await failStaleTattooTasks(userId);

  let row = await findTask(taskId);
  if (
    !row ||
    row.userId !== userId ||
    row.scene !== TATTOO_TASK_SCENE ||
    row.deletedAt
  ) {
    return null;
  }

  await closeIfStale(row);
  row = await findTask(taskId);
  if (!row) return null;

  if (
    row.provider === 'kie' &&
    (row.status === AITaskStatus.PENDING ||
      row.status === AITaskStatus.PROCESSING)
  ) {
    await refreshKieTask(row);
    const refreshed = await findTask(taskId);
    return refreshed ? toTaskView(refreshed) : null;
  }

  return toTaskView(row);
}
