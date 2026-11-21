import { and, desc, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '@/core/db';
import { atomic, AtomicGuardError, guard } from '@/core/db/atomic';
import { aiTask } from '@/config/db/schema';
import { planConsume, planRevoke } from '@/modules/credits/service';
import { getUuid } from '@/lib/hash';

export enum AITaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

/**
 * Create an AI task with optional credit consumption.
 */
export async function createTask(params: {
  id?: string;
  userId: string;
  mediaType: string;
  provider: string;
  model: string;
  prompt: string;
  costCredits?: number;
  options?: any;
  scene?: string;
  taskId?: string;
}): Promise<any> {
  const {
    id,
    userId,
    mediaType,
    provider,
    model,
    prompt,
    costCredits,
    options,
    scene,
    taskId,
  } = params;

  if (id) {
    const existing = await findTask(id);
    if (existing) return Object.assign(existing, { __reused: true });
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const taskData: typeof aiTask.$inferInsert = {
      id: id || getUuid(),
      userId,
      mediaType,
      provider,
      model,
      prompt,
      status: AITaskStatus.PENDING,
      costCredits: costCredits || 0,
      scene: scene || '',
      taskId: taskId || null,
      options: options ? JSON.stringify(options) : null,
    };

    // Plan the credit charge first, then write the task and the charge in one
    // atomic step (D1-safe) — never a task without its charge or vice versa.
    const plan =
      costCredits && costCredits > 0
        ? await planConsume({
            userId,
            credits: costCredits,
            scene: scene || 'ai_task',
            description: `AI ${mediaType} generation`,
            metadata: JSON.stringify({ taskId: taskData.id }),
          })
        : undefined;
    if (plan === null) throw new Error('Insufficient credits');
    if (plan) {
      // Stored on the task (and in taskInfo for older readers) so a failure
      // can restore exactly this consumption.
      taskData.creditId = plan.consumedCredit.id;
      taskData.taskInfo = JSON.stringify({
        creditId: plan.consumedCredit.id,
      });
    }

    try {
      await atomic((q) => [
        q.insert(aiTask).values(taskData),
        ...(plan ? plan.steps(q) : []),
      ]);
    } catch (error) {
      // A concurrent spend drained the grants we planned on: re-plan.
      if (error instanceof AtomicGuardError) continue;

      // A duplicate id means another request with the same idempotency id
      // already created the task. Return it instead of charging twice.
      if (id) {
        const [existing] = await db()
          .select()
          .from(aiTask)
          .where(eq(aiTask.id, id))
          .limit(1);
        if (existing) {
          return Object.assign(existing, { __reused: true });
        }
      }
      throw error;
    }

    const [task] = await db()
      .select()
      .from(aiTask)
      .where(eq(aiTask.id, taskData.id))
      .limit(1);
    return task;
  }
  throw new Error('Insufficient credits');
}

/**
 * Update task status. Revokes credits on failure.
 *
 * The status change is claimed atomically (pending/processing only), so a
 * duplicate failure callback cannot refund twice, and a late failure cannot
 * overwrite a success. The refund steps are part of the same atomic write.
 */
export async function updateTask(params: {
  taskId: string;
  status: AITaskStatus;
  taskResult?: any;
  taskInfo?: any;
  providerTaskId?: string;
}): Promise<boolean> {
  const { taskId, status, taskResult, taskInfo, providerTaskId } = params;

  const [task] = await db()
    .select()
    .from(aiTask)
    .where(eq(aiTask.id, taskId))
    .limit(1);

  if (!task) throw new Error('Task not found');

  const updateData: any = { status };
  if (taskResult !== undefined) {
    updateData.taskResult = JSON.stringify(taskResult);
  }
  if (taskInfo !== undefined) {
    updateData.taskInfo = JSON.stringify(taskInfo);
  }
  if (providerTaskId) {
    updateData.taskId = providerTaskId;
  }

  // Fall back to the legacy taskInfo copy for rows created before the
  // dedicated credit_id column was populated.
  let creditId = task.creditId;
  if (!creditId && task.taskInfo) {
    try {
      creditId = JSON.parse(task.taskInfo as string)?.creditId ?? null;
    } catch {
      creditId = null;
    }
  }
  const refund =
    status === AITaskStatus.FAILED && creditId
      ? await planRevoke(creditId)
      : null;

  try {
    await atomic((q) => [
      guard({
        table: aiTask,
        column: 'userId',
        where: eq(aiTask.id, taskId),
        require: inArray(aiTask.status, [
          AITaskStatus.PENDING,
          AITaskStatus.PROCESSING,
        ]),
        message: 'Task already finished',
      }),
      q.update(aiTask).set(updateData).where(eq(aiTask.id, taskId)),
      ...(refund ? refund.steps(q) : []),
    ]);
    return true;
  } catch (error) {
    if (error instanceof AtomicGuardError) return false;
    throw error;
  }
}

/**
 * Get tasks for a user.
 */
export async function getTasks(params: {
  userId: string;
  mediaType?: string;
  status?: string;
  scene?: string;
  page?: number;
  limit?: number;
}) {
  const { userId, mediaType, status, scene, page = 1, limit = 20 } = params;

  return db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.userId, userId),
        mediaType ? eq(aiTask.mediaType, mediaType) : undefined,
        status ? eq(aiTask.status, status) : undefined,
        scene ? eq(aiTask.scene, scene) : undefined,
        isNull(aiTask.deletedAt)
      )
    )
    .orderBy(desc(aiTask.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);
}

/**
 * Find task by ID.
 */
export async function findTask(taskId: string) {
  const [result] = await db()
    .select()
    .from(aiTask)
    .where(eq(aiTask.id, taskId))
    .limit(1);
  return result;
}
