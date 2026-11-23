import { createFileRoute } from '@tanstack/react-router';
import {
  publishRemoteImage,
  uploadGeneratedImage,
} from '@/server/tattoo/storage';
import { toTaskView } from '@/server/tattoo/tasks';

import { AIMediaType, GeminiProvider, KieProvider } from '@/core/ai';
import { getAuth } from '@/core/auth';
import {
  TATTOO_GENERATION_COSTS,
  TATTOO_TASK_SCENE,
  type TattooGenerationTier,
} from '@/config/tattoo-credits';
import {
  AITaskStatus,
  createTask,
  findTask,
  updateTask,
} from '@/modules/ai-tasks/service';
import { getAllConfigs } from '@/modules/config/service';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

/**
 * Tattoo AI Model Routing:
 * - Fast Body Preview: Google Gemini 3.1 Flash Image (Nano Banana 2)
 * - High-Quality Body Preview / Clean Artwork: Nano Banana Pro
 */
export const TATTOO_AI_MODELS = {
  fast_body_preview: {
    label: 'Google Gemini 3.1 Flash Image (Nano Banana 2)',
    geminiModel: 'gemini-3.1-flash-image-preview',
    kieModel: 'nano-banana-2',
  },
  hq_body_preview: {
    label: 'Nano Banana Pro',
    geminiModel: 'gemini-3-pro-image-preview',
    kieModel: 'nano-banana-pro',
  },
  clean_artwork: {
    label: 'Nano Banana Pro',
    geminiModel: 'gemini-3-pro-image-preview',
    kieModel: 'nano-banana-pro',
  },
} as const;

export type { TattooGenerationTier };

const MAX_PROMPT_LENGTH = 1600;
const MAX_REFERENCE_DATA_URL_LENGTH = 12 * 1024 * 1024;

const BODY_PART_VIEWS: Record<string, string[]> = {
  back: ['back-view'],
  'chest-torso': ['male-front-torso', 'male-side-ribs'],
  arm: ['outer-arm', 'inner-arm'],
  leg: ['front-leg', 'back-leg', 'outer-leg'],
  hand: ['back-of-hand', 'palm'],
  'foot-ankle': ['top-outer-foot-ankle'],
  'neck-ear': ['front-neck-collarbone', 'side-neck-behind-ear', 'back-of-neck'],
};
const SKIN_TONES = new Set([
  'natural-fair',
  'warm-ivory',
  'medium-light',
  'medium',
  'medium-dark',
  'dark',
]);
const MODELS = new Set(['man', 'woman']);

interface PlacementPoint {
  x: number;
  y: number;
}

interface PlacementInput {
  partId: string;
  viewId: string;
  model?: string;
  skinTone?: string;
  points?: PlacementPoint[];
}

function normalizePlacement(value: any): PlacementInput | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const partId = String(value.partId || '');
  const viewId = String(value.viewId || '');
  const views = BODY_PART_VIEWS[partId];
  if (!views || !views.includes(viewId)) {
    throw new Error('Invalid body placement');
  }

  const model =
    typeof value.model === 'string' && MODELS.has(value.model)
      ? value.model
      : undefined;
  const skinTone =
    typeof value.skinTone === 'string' && SKIN_TONES.has(value.skinTone)
      ? value.skinTone
      : undefined;

  const rawPoints = Array.isArray(value.points) ? value.points : [];
  if (rawPoints.length > 0 && rawPoints.length < 3) {
    throw new Error('Draw at least 3 points to mark a placement');
  }
  if (rawPoints.length > 500) {
    throw new Error('Too many placement points');
  }
  const points: PlacementPoint[] = [];
  for (const point of rawPoints) {
    const x = Number(point?.x);
    const y = Number(point?.y);
    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      x < 0 ||
      x > 1 ||
      y < 0 ||
      y > 1
    ) {
      throw new Error('Invalid placement coordinates');
    }
    points.push({ x, y });
  }

  return { partId, viewId, model, skinTone, points };
}

function isTrustedRequestOrigin(origin: string | undefined, appUrl: string) {
  if (!origin) return false;

  try {
    const app = new URL(appUrl);
    const candidate = new URL(origin);
    if (candidate.origin === app.origin) return true;

    const localHosts = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
    if (localHosts.has(app.hostname) && localHosts.has(candidate.hostname)) {
      return true;
    }

    const trusted = (process.env.AUTH_TRUSTED_ORIGINS || '')
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
    for (const entry of trusted) {
      if (entry.startsWith('.')) {
        if (candidate.hostname.endsWith(entry)) return true;
      } else {
        if (entry === candidate.hostname) return true;
        try {
          if (new URL(entry).origin === candidate.origin) return true;
        } catch {
          // Not a URL; the host comparison above is the only useful check.
        }
      }
    }
  } catch {
    return false;
  }

  return false;
}

function isAllowedReferenceImage(
  value: string,
  appUrl: string,
  requestOrigin?: string
): boolean {
  if (/^data:image\/(png|jpe?g|webp);base64,/i.test(value)) {
    return value.length <= MAX_REFERENCE_DATA_URL_LENGTH;
  }

  try {
    const base = new URL(appUrl);
    const url = new URL(value, base);
    const sameAppOrigin = url.origin === base.origin;
    const sameRequestOrigin =
      Boolean(requestOrigin) &&
      url.origin === requestOrigin &&
      isTrustedRequestOrigin(requestOrigin, appUrl);
    if (!sameAppOrigin && !sameRequestOrigin) return false;
    return (
      url.pathname.startsWith('/tattoo-generator/body-references/') &&
      !url.pathname.includes('..')
    );
  } catch {
    return false;
  }
}

function isPubliclyFetchableUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    const host = url.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host === '[::1]' ||
      host.endsWith('.local')
    ) {
      return false;
    }
    if (
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function taskResponse(row: any) {
  const view = toTaskView(row);
  if (view.status === AITaskStatus.SUCCESS) {
    return view.imageUrl
      ? respData({
          taskId: view.id,
          tier: view.tier,
          model: view.model,
          modelLabel: view.modelLabel,
          status: 'success',
          imageUrl: view.imageUrl,
        })
      : respData({
          taskId: view.id,
          tier: view.tier,
          model: view.model,
          modelLabel: view.modelLabel,
          status: 'failed',
          imageUrl: null,
          error: 'The AI provider returned no image',
        });
  }
  if (
    view.status === AITaskStatus.FAILED ||
    view.status === AITaskStatus.CANCELED
  ) {
    return respData({
      taskId: view.id,
      tier: view.tier,
      model: view.model,
      modelLabel: view.modelLabel,
      status: 'failed',
      imageUrl: null,
      error: view.error || 'Generation failed',
    });
  }
  return respData({
    taskId: view.id,
    tier: view.tier,
    model: view.model,
    modelLabel: view.modelLabel,
    status: 'processing',
    imageUrl: null,
  });
}

function buildTattooPrompt(params: {
  tier: TattooGenerationTier;
  prompt: string;
  style?: string;
  placement?: PlacementInput;
  placementLabel?: string;
  hasReference?: boolean;
  hasPlacementMark?: boolean;
}): string {
  const {
    tier,
    prompt,
    style,
    placement,
    placementLabel,
    hasReference,
    hasPlacementMark,
  } = params;
  const stylePart =
    style && style !== 'pick-for-me' ? `, in ${style} tattoo style` : '';

  if (tier === 'clean_artwork') {
    return `Clean 2D tattoo stencil artwork on a pure solid white background (#FFFFFF), crisp ink linework and shading, flat front-facing reference ready for a tattoo artist, no body, no skin, no background clutter: ${prompt}${stylePart}.`;
  }

  const qualityNote =
    tier === 'hq_body_preview'
      ? 'High-resolution studio photography, ultra-detailed realistic healed tattoo ink blended into natural skin texture and anatomical contours'
      : 'Realistic tattoo body preview photography, natural skin lighting and anatomical placement';

  const regionLabel = placement
    ? `${placement.partId}/${placement.viewId}${placementLabel ? ` (${placementLabel})` : ''}`
    : placementLabel;
  const pointsText =
    placement?.points && placement.points.length >= 3
      ? placement.points
          .map((p) => `(${p.x.toFixed(3)},${p.y.toFixed(3)})`)
          .join(' ')
      : '';

  const placementPart = regionLabel
    ? `The tattoo must be placed only on the user-selected body region: ${regionLabel}.`
    : '';
  const regionPart = pointsText
    ? `The selected region is the polygon with these normalized coordinates (origin at top-left, x/y in 0..1): ${pointsText}. Keep the tattoo entirely inside this polygon and follow the body contour there.`
    : '';
  const subjectPart =
    placement?.model === 'woman'
      ? 'The person is a woman; keep the reference pose, framing and skin tone while presenting a female body.'
      : placement?.model === 'man'
        ? 'The person is a man; keep the reference pose, framing and skin tone while presenting a male body.'
        : '';

  return [
    qualityNote + ':',
    prompt + stylePart + '.',
    hasReference
      ? 'Use the attached body reference photo as the exact same pose, camera angle, skin tone, lighting and background. Do not crop or resize the body.'
      : 'Show the tattoo on a realistic body area with natural skin and lighting.',
    hasPlacementMark
      ? 'A translucent pink outline in the reference marks the allowed placement area; use it only as a position guide and do not reproduce the pink color or overlay in the result.'
      : '',
    subjectPart,
    placementPart,
    regionPart,
    'The tattoo must look naturally healed and integrated into the skin at that exact location.',
  ]
    .filter(Boolean)
    .join(' ');
}

async function POST({ request }: { request: Request }) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 1500,
    keyPrefix: 'tattoo-generate',
  });
  if (limited) return limited;

  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return respErr('Unauthorized');
    }

    const userLimited = enforceMinIntervalRateLimit(request, {
      intervalMs: 1500,
      keyPrefix: 'tattoo-generate',
      extraKey: session.user.id,
    });
    if (userLimited) return userLimited;

    const body = await request.json();
    const requestId =
      typeof body?.requestId === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        body.requestId
      )
        ? body.requestId.toLowerCase()
        : undefined;
    const rawPrompt = String(body?.prompt ?? '').trim();
    if (!rawPrompt) {
      return respErr('Prompt is required');
    }
    if (rawPrompt.length > MAX_PROMPT_LENGTH) {
      return respErr('Prompt is too long');
    }

    const tier: TattooGenerationTier =
      body?.tier === 'hq_body_preview' || body?.tier === 'clean_artwork'
        ? body.tier
        : 'fast_body_preview';
    const style =
      typeof body?.style === 'string' ? body.style.slice(0, 80) : undefined;
    const placementLabel =
      typeof body?.placementLabel === 'string'
        ? body.placementLabel.slice(0, 200)
        : undefined;
    const placement = normalizePlacement(body?.placement);
    const referenceImage =
      typeof body?.referenceImage === 'string'
        ? body.referenceImage
        : undefined;
    const placementImage =
      typeof body?.placementImage === 'string'
        ? body.placementImage
        : undefined;

    const configs = await getAllConfigs();
    const appUrl = configs.app_url || 'http://localhost:3000';
    const requestOrigin = new URL(request.url).origin;
    if (
      referenceImage &&
      !isAllowedReferenceImage(referenceImage, appUrl, requestOrigin)
    ) {
      return respErr('Invalid body reference image');
    }
    if (
      placementImage &&
      !isAllowedReferenceImage(placementImage, appUrl, requestOrigin)
    ) {
      return respErr('Invalid placement reference image');
    }

    // A request id is the task id, so a retry after a lost response returns
    // the original task instead of charging the user twice.
    if (requestId) {
      const existing = await findTask(requestId);
      if (existing) {
        if (
          existing.userId !== session.user.id ||
          existing.scene !== TATTOO_TASK_SCENE
        ) {
          return respErr('Request id already used');
        }
        return taskResponse(existing);
      }
    }

    const geminiApiKey =
      configs.gemini_api_key?.trim() || process.env.GEMINI_API_KEY || '';
    const kieApiKey =
      configs.kie_api_key?.trim() || process.env.KIE_API_KEY || '';
    const providerName = geminiApiKey ? 'gemini' : kieApiKey ? 'kie' : null;
    if (!providerName) {
      return respErr('AI provider is not configured');
    }

    const modelSpec = TATTOO_AI_MODELS[tier];
    const selectedModel =
      providerName === 'kie' ? modelSpec.kieModel : modelSpec.geminiModel;
    let kieReference =
      providerName === 'kie' &&
      tier !== 'clean_artwork' &&
      referenceImage &&
      isPubliclyFetchableUrl(referenceImage)
        ? referenceImage
        : undefined;
    if (
      providerName === 'kie' &&
      tier !== 'clean_artwork' &&
      referenceImage &&
      !kieReference
    ) {
      // The app may be running on localhost (or behind a private URL). Copy
      // the reference to public storage so Kie can fetch it instead of
      // silently generating without the selected body.
      kieReference = (await publishRemoteImage(referenceImage)) ?? undefined;
    }
    if (
      providerName === 'kie' &&
      tier !== 'clean_artwork' &&
      referenceImage &&
      !kieReference
    ) {
      return respErr(
        'The selected body reference is not publicly accessible to the AI provider. Configure Storage or use a public app URL.'
      );
    }
    const fullPrompt = buildTattooPrompt({
      tier,
      prompt: rawPrompt,
      style,
      placement,
      placementLabel,
      hasReference:
        providerName === 'kie'
          ? Boolean(kieReference)
          : Boolean(referenceImage || placementImage),
      hasPlacementMark: providerName !== 'kie' && Boolean(placementImage),
    });

    const creditsEnabled = configs.credits_enabled !== 'false';
    const costCredits = creditsEnabled ? TATTOO_GENERATION_COSTS[tier] : 0;

    const task = await createTask({
      id: requestId,
      userId: session.user.id,
      mediaType: AIMediaType.IMAGE,
      provider: providerName,
      model: selectedModel,
      prompt: fullPrompt,
      costCredits,
      scene: TATTOO_TASK_SCENE,
      options: {
        tier,
        style,
        placement,
        modelLabel: modelSpec.label,
        userPrompt: rawPrompt,
      },
    });

    // createTask() returns an existing row if this request id lost a race.
    // Never run the provider or charge again for the same request.
    if ((task as any).__reused) {
      if (task.userId !== session.user.id || task.scene !== TATTOO_TASK_SCENE) {
        return respErr('Request id already used');
      }
      return taskResponse(task);
    }

    // A flat stencil is a white-background artwork; sending a body photo would
    // make the model paint on skin instead.
    const effectiveReference =
      tier === 'clean_artwork' ? undefined : referenceImage;
    const effectivePlacementImage =
      tier === 'clean_artwork' ? undefined : placementImage;

    try {
      if (providerName === 'gemini') {
        let storedImage: {
          url: string;
          storageKey: string;
          contentType: string;
        } | null = null;
        const gemini = new GeminiProvider({
          apiKey: geminiApiKey,
          uploadFile: async ({ body: fileBuf, contentType }) => {
            storedImage = await uploadGeneratedImage({
              body: fileBuf,
              contentType,
              taskId: task.id,
            });
            return { url: storedImage.url };
          },
        });

        const imageInput = effectivePlacementImage
          ? [effectivePlacementImage]
          : effectiveReference
            ? [effectiveReference]
            : [];
        const res = await gemini.generate({
          params: {
            mediaType: AIMediaType.IMAGE,
            model: selectedModel,
            prompt: fullPrompt,
            options: imageInput.length
              ? { image_input: imageInput }
              : undefined,
          },
        });

        const imageUrl = res.taskInfo?.images?.[0]?.imageUrl ?? null;
        if (!imageUrl) {
          await updateTask({
            taskId: task.id,
            status: AITaskStatus.FAILED,
            taskResult: { error: 'The AI provider returned no image' },
          });
          return respErr('The AI provider returned no image');
        }

        const settled = await updateTask({
          taskId: task.id,
          status: AITaskStatus.SUCCESS,
          // Keep only a compact summary. The full provider payload can contain
          // the same base64 image a second time and bloat the task row.
          taskInfo: { status: AITaskStatus.SUCCESS, model: selectedModel },
          taskResult: {
            imageUrl,
            storageKey: storedImage?.storageKey,
            contentType: storedImage?.contentType,
            tier,
            modelLabel: modelSpec.label,
          },
        });
        if (!settled) {
          return respErr('Task already finished');
        }

        return respData({
          taskId: task.id,
          tier,
          model: selectedModel,
          modelLabel: modelSpec.label,
          status: 'success',
          imageUrl,
        });
      }

      const kie = new KieProvider({ apiKey: kieApiKey });
      const res = await kie.generate({
        params: {
          mediaType: AIMediaType.IMAGE,
          model: selectedModel,
          prompt: fullPrompt,
          // Kie can only fetch public URLs. Local/private references are
          // rejected above instead of silently generating without the body.
          options: kieReference ? { image_input: [kieReference] } : undefined,
        },
      });

      await updateTask({
        taskId: task.id,
        status: AITaskStatus.PROCESSING,
        providerTaskId: res.taskId,
        taskResult: {
          tier,
          modelLabel: modelSpec.label,
          providerStatus: res.taskStatus,
        },
      });

      return respData({
        taskId: task.id,
        tier,
        model: selectedModel,
        modelLabel: modelSpec.label,
        status: 'processing',
        imageUrl: null,
      });
    } catch (error: any) {
      await updateTask({
        taskId: task.id,
        status: AITaskStatus.FAILED,
        taskResult: { error: error?.message || 'Generation failed' },
      });
      throw error;
    }
  } catch (error: any) {
    return respErr(error?.message || 'Failed to generate tattoo preview');
  }
}

export const Route = createFileRoute('/api/tattoo/generate')({
  server: {
    handlers: { POST },
  },
});
