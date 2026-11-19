import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { AIMediaType, GeminiProvider, KieProvider } from '@/core/ai';
import { getAllConfigs } from '@/modules/config/service';
import { createTask, updateTask, AITaskStatus } from '@/modules/ai-tasks/service';
import { respData, respErr } from '@/lib/resp';

/**
 * Tattoo AI Model Routing:
 * - Fast Body Preview (快速身体预览):
 *   Google Gemini 3.1 Flash Image (Nano Banana 2) -> `gemini-3.1-flash-image-preview` (Gemini API) or `nano-banana-2` (Kie)
 * - High-Quality Outputs (高质量输出 — 高质量身体预览 & 白底图稿):
 *   Nano Banana Pro -> `gemini-3-pro-image-preview` (Gemini API) or `nano-banana-pro` (Kie)
 */
export const TATTOO_AI_MODELS = {
  fast_body_preview: {
    label: 'Google Gemini 3.1 Flash Image (Nano Banana 2)',
    geminiModel: 'gemini-3.1-flash-image-preview',
    kieModel: 'nano-banana-2',
    costCredits: 2,
  },
  hq_body_preview: {
    label: 'Nano Banana Pro',
    geminiModel: 'gemini-3-pro-image-preview',
    kieModel: 'nano-banana-pro',
    costCredits: 2,
  },
  clean_artwork: {
    label: 'Nano Banana Pro',
    geminiModel: 'gemini-3-pro-image-preview',
    kieModel: 'nano-banana-pro',
    costCredits: 2,
  },
} as const;

export type TattooGenerationTier = keyof typeof TATTOO_AI_MODELS;

function buildTattooPrompt(params: {
  tier: TattooGenerationTier;
  prompt: string;
  style?: string;
  placement?: string;
}): string {
  const { tier, prompt, style, placement } = params;
  const stylePart =
    style && style !== 'pick-for-me' ? `, in ${style} tattoo style` : '';
  const placePart = placement ? `, placed naturally on the ${placement}` : '';

  if (tier === 'clean_artwork') {
    return `Clean 2D tattoo stencil artwork on a pure solid white background (#FFFFFF), crisp ink linework and shading, flat front-facing reference ready for a tattoo artist, no body, no skin, no background clutter: ${prompt}${stylePart}.`;
  }

  const qualityNote =
    tier === 'hq_body_preview'
      ? 'High-resolution studio photography, ultra-detailed realistic healed tattoo ink blended into natural skin texture and anatomical contours'
      : 'Realistic tattoo body preview photography, natural skin lighting and anatomical placement';

  return `${qualityNote}: ${prompt}${stylePart}${placePart}.`;
}

async function POST({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return respErr('Unauthorized');
    }

    const body = await request.json();
    const rawPrompt = String(body?.prompt ?? '').trim();
    if (!rawPrompt) {
      return respErr('Prompt is required');
    }

    const tier: TattooGenerationTier =
      body?.tier === 'hq_body_preview' || body?.tier === 'clean_artwork'
        ? body.tier
        : 'fast_body_preview';
    const style = typeof body?.style === 'string' ? body.style : undefined;
    const placement =
      typeof body?.placement === 'string' ? body.placement : undefined;
    const referenceImage =
      typeof body?.referenceImage === 'string' ? body.referenceImage : undefined;

    const modelSpec = TATTOO_AI_MODELS[tier];
    const fullPrompt = buildTattooPrompt({
      tier,
      prompt: rawPrompt,
      style,
      placement,
    });

    const configs = await getAllConfigs();
    const geminiApiKey =
      configs.gemini_api_key?.trim() || process.env.GEMINI_API_KEY || '';
    const kieApiKey =
      configs.kie_api_key?.trim() || process.env.KIE_API_KEY || '';

    const providerName = geminiApiKey ? 'gemini' : kieApiKey ? 'kie' : 'gemini';
    const selectedModel =
      providerName === 'kie' ? modelSpec.kieModel : modelSpec.geminiModel;

    // If an AI provider key is configured, run a tracked AI task; otherwise return
    // the routed model metadata and preview fallback so dev/demo works out of the box.
    if (geminiApiKey) {
      const task = await createTask({
        userId: session.user.id,
        mediaType: AIMediaType.IMAGE,
        provider: 'gemini',
        model: selectedModel,
        prompt: fullPrompt,
        costCredits: 0,
      });

      try {
        const gemini = new GeminiProvider({
          apiKey: geminiApiKey,
          uploadFile: async ({ body: fileBuf, contentType }) => {
            const b64 = Buffer.from(fileBuf).toString('base64');
            return { url: `data:${contentType};base64,${b64}` };
          },
        });

        const res = await gemini.generate({
          params: {
            mediaType: AIMediaType.IMAGE,
            model: selectedModel,
            prompt: fullPrompt,
            options: referenceImage
              ? { image_input: [referenceImage] }
              : undefined,
          },
        });

        await updateTask({
          taskId: task.id,
          status: AITaskStatus.SUCCESS,
          taskResult: res.taskInfo,
        });

        return respData({
          taskId: task.id,
          tier,
          model: selectedModel,
          modelLabel: modelSpec.label,
          imageUrl: res.taskInfo?.images?.[0]?.imageUrl ?? null,
        });
      } catch (err: any) {
        await updateTask({
          taskId: task.id,
          status: AITaskStatus.FAILED,
          taskResult: { error: err?.message || 'Generation failed' },
        });
        throw err;
      }
    }

    if (kieApiKey) {
      const kie = new KieProvider({ apiKey: kieApiKey });
      const res = await kie.generate({
        params: {
          mediaType: AIMediaType.IMAGE,
          model: selectedModel,
          prompt: fullPrompt,
          options: referenceImage
            ? { image_input: [referenceImage] }
            : undefined,
        },
      });
      return respData({
        taskId: res.taskId,
        tier,
        model: selectedModel,
        modelLabel: modelSpec.label,
        imageUrl: res.taskInfo?.images?.[0]?.imageUrl ?? null,
      });
    }

    return respData({
      taskId: crypto.randomUUID(),
      tier,
      model: selectedModel,
      modelLabel: modelSpec.label,
      imageUrl:
        tier === 'clean_artwork'
          ? '/home-values/phoenix-clean-artwork.webp'
          : '/home-values/phoenix-body-preview.webp',
    });
  } catch (error: any) {
    return respErr(error?.message || 'Failed to generate tattoo preview');
  }
}

export const Route = createFileRoute('/api/tattoo/generate')({
  server: {
    handlers: { POST },
  },
});
