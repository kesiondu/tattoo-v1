import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Download,
  FileText,
  HelpCircle,
  Loader2,
  Share2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import {
  TATTOO_GENERATION_COSTS,
  TATTOO_PREVIEW_PLUS_ARTWORK_COST,
  type TattooGenerationTier,
} from '@/config/tattoo-credits';
import { apiGet, apiPost } from '@/lib/api-client';
import { traceStencilFromBlob } from '@/lib/trace-stencil';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { usePublicConfig } from '@/hooks/use-public-config';
import {
  BODY_PARTS,
  BodyPlacementModal,
  getBodyReferenceSrc,
  pointsToSvgPath,
  type BodyPlacementSelection,
  type ModelGender,
  type SkinToneId,
} from '@/components/body-placement-modal';
import { CreditBundlePricing } from '@/components/credit-bundle-pricing';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HeroGeneratorProps {
  onOpenAuth?: () => void;
  initialStyle?: string;
  initialPrompt?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  promptPlaceholder?: string;
  externalPrompt?: { text: string; key: number } | null;
  stencilMode?: boolean;
}

interface StyleItem {
  id: string;
  label: () => string;
  img: string;
  isAuto?: boolean;
}

const PRIMARY_STYLES: StyleItem[] = [
  {
    id: 'pick-for-me',
    label: () => m['home.style.pick_for_me'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/pick-for-me.jpg',
    isAuto: true,
  },
  {
    id: 'fine-line',
    label: () => m['home.style.fine_line'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/fine-line.jpg',
  },
  {
    id: 'minimalist',
    label: () => m['home.style.minimalist'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/minimalist.jpg',
  },
  {
    id: 'lettering',
    label: () => m['home.style.lettering'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/lettering.jpg',
  },
  {
    id: 'realism',
    label: () => m['home.style.realism'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/realism.jpg',
  },
  {
    id: 'black-grey',
    label: () => m['home.style.black_grey'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/black-grey.jpg',
  },
  {
    id: 'american-traditional',
    label: () => m['home.style.american_traditional'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/old-school.jpg',
  },
  {
    id: 'japanese',
    label: () => m['home.style.japanese'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/japanese.jpg',
  },
  {
    id: 'blackwork',
    label: () => m['home.style.blackwork'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/blackwork.jpg',
  },
  {
    id: 'geometric',
    label: () => m['home.style.geometric'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/geometric.jpg',
  },
  {
    id: 'neo-traditional',
    label: () => m['home.style.neo_traditional'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/neo-traditional.jpg',
  },
  {
    id: 'micro-realism',
    label: () => m['home.style.micro_realism'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/micro-realism.jpg',
  },
];

const EXTRA_STYLES: StyleItem[] = [
  {
    id: 'watercolor',
    label: () => m['home.style.watercolor'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/watercolor.jpg',
  },
  {
    id: 'tribal',
    label: () => m['home.style.tribal'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/tribal.jpg',
  },
  {
    id: 'cyberpunk',
    label: () => m['home.style.cyberpunk'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/cyberpunk.jpg',
  },
  {
    id: 'anime',
    label: () => m['home.style.anime'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/anime.jpg',
  },
  {
    id: 'dotwork',
    label: () => m['home.style.dotwork'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/dotwork.jpg',
  },
  {
    id: 'sketch',
    label: () => m['home.style.sketch'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/sketch.jpg',
  },
  {
    id: 'celtic',
    label: () => m['home.style.celtic'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/celtic.jpg',
  },
  {
    id: 'trash-polka',
    label: () => m['home.style.trash_polka'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/trash-polka.jpg',
  },
  {
    id: 'chicano',
    label: () => m['home.style.chicano'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/chicano.jpg',
  },
  {
    id: 'illustrative',
    label: () => m['home.style.illustrative'](),
    img: 'https://assets.tattoogenerator.online/v1/assets/styles-v2/illustrative.jpg',
  },
];

const ALL_STYLES = [...PRIMARY_STYLES, ...EXTRA_STYLES];

const DRAFT_KEY = 'tattoo:generator:draft:v1';
const ACTIVE_TASK_KEY = 'tattoo:active-task:v1';
const PENDING_REQUEST_KEY = 'tattoo:pending-request:v1';
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const PENDING_REQUEST_TTL_MS = 30 * 60 * 1000;

type DraftOwner = { ownerId: string };

type TattooDraft = DraftOwner & {
  v: 1;
  updatedAt: number;
  prompt: string;
  style: string;
  placement: BodyPlacementSelection | null;
  skinTone: SkinToneId;
  model: ModelGender;
  stencilSize: string;
  openStep: 1 | 2 | 3 | null;
  previewTab: 'body' | 'artwork';
};

type ActiveTaskDraft = DraftOwner & {
  id: string;
  tier: TattooGenerationTier;
  updatedAt: number;
};

type PendingRequest = DraftOwner & {
  id: string;
  signature: string;
  updatedAt: number;
};

function readSessionJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeSessionJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota/unavailable: the page still works, it just won't survive a reload.
  }
}

function removeSessionValue(key: string) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function ownerIdOf(userId?: string | null) {
  return userId || 'anonymous';
}

function canRestoreForOwner(
  value: DraftOwner | null,
  userId?: string | null
): boolean {
  if (!value) return false;
  if (!userId) return value.ownerId === 'anonymous';
  return value.ownerId === 'anonymous' || value.ownerId === userId;
}

function readTattooDraft(userId?: string | null): TattooDraft | null {
  const draft = readSessionJson<TattooDraft>(DRAFT_KEY);
  if (!draft || draft.v !== 1) return null;
  if (!canRestoreForOwner(draft, userId)) return null;
  if (!draft.updatedAt || Date.now() - draft.updatedAt > DRAFT_TTL_MS) {
    removeSessionValue(DRAFT_KEY);
    return null;
  }
  return draft;
}

function readActiveTask(userId?: string | null): ActiveTaskDraft | null {
  const task = readSessionJson<ActiveTaskDraft>(ACTIVE_TASK_KEY);
  if (!task || !task.id) return null;
  if (!canRestoreForOwner(task, userId)) return null;
  if (!task.updatedAt || Date.now() - task.updatedAt > DRAFT_TTL_MS) {
    removeSessionValue(ACTIVE_TASK_KEY);
    return null;
  }
  return task;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error('Could not load the body reference'));
    image.src = src;
  });
}

/**
 * The placement modal records points against a 3:4 container that shows the
 * 2:3 body photo with `object-contain` (letterboxed on the left/right).
 * Convert those points to the body image itself and render the same lasso on
 * the reference. Kie receives both the marked image and the normalized
 * polygon, so placement is a visible constraint as well as a text instruction.
 */
async function buildPlacementReference(
  selection: BodyPlacementSelection
): Promise<{
  placement: BodyPlacementSelection;
  markedReference: string;
}> {
  const src = new URL(
    getBodyReferenceSrc(selection.partId, selection.viewId, selection.skinTone),
    window.location.origin
  ).toString();

  const image = await loadImage(src);
  const containerAspect = 3 / 4;
  const imageAspect = image.naturalWidth / image.naturalHeight;

  let drawWidth = 1;
  let drawHeight = 1;
  let offsetX = 0;
  let offsetY = 0;
  if (imageAspect > containerAspect) {
    drawHeight = containerAspect / imageAspect;
    offsetY = (1 - drawHeight) / 2;
  } else {
    drawWidth = imageAspect / containerAspect;
    offsetX = (1 - drawWidth) / 2;
  }

  const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
  const points = selection.points.map((point) => ({
    x: clamp01((point.x - offsetX) / drawWidth),
    y: clamp01((point.y - offsetY) / drawHeight),
  }));

  const canvas = document.createElement('canvas');
  const maxEdge = 1600;
  const scale = Math.min(
    1,
    maxEdge / Math.max(image.naturalWidth, image.naturalHeight)
  );
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not prepare the placement reference');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  context.beginPath();
  points.forEach((point, index) => {
    const x = point.x * canvas.width;
    const y = point.y * canvas.height;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.closePath();
  context.fillStyle = 'rgba(236, 72, 153, 0.30)';
  context.strokeStyle = '#ec4899';
  context.lineWidth = Math.max(
    3,
    Math.round(Math.min(canvas.width, canvas.height) * 0.006)
  );
  context.fill();
  context.stroke();

  return {
    placement: { ...selection, points },
    markedReference: canvas.toDataURL('image/png'),
  };
}

export function HeroGenerator({
  onOpenAuth,
  initialStyle,
  initialPrompt,
  heroTitle,
  heroSubtitle,
  promptPlaceholder,
  externalPrompt,
  stencilMode = false,
}: HeroGeneratorProps) {
  const { data: session, isPending: sessionPending } = useSession();
  const { data: publicConfigs } = usePublicConfig();
  const showCredits = publicConfigs?.credits_enabled !== 'false';

  const validInitialStyle =
    initialStyle && ALL_STYLES.some((s) => s.id === initialStyle)
      ? initialStyle
      : 'pick-for-me';
  const [openStep, setOpenStep] = useState<1 | 2 | 3 | null>(
    initialStyle ? 2 : 1
  );
  const [selectedStyle, setSelectedStyle] = useState<string>(validInitialStyle);
  const [showAllStyles, setShowAllStyles] = useState(
    EXTRA_STYLES.some((s) => s.id === validInitialStyle)
  );
  const [prompt, setPrompt] = useState(initialPrompt ?? '');

  useEffect(() => {
    setSelectedStyle(validInitialStyle);
    if (EXTRA_STYLES.some((s) => s.id === validInitialStyle)) {
      setShowAllStyles(true);
    }
  }, [validInitialStyle]);

  useEffect(() => {
    if (externalPrompt?.text) {
      setPrompt(externalPrompt.text);
      setOpenStep(2);
    }
  }, [externalPrompt]);
  const [placement, setPlacement] = useState<BodyPlacementSelection | null>(
    null
  );
  const [skinTone, setSkinTone] = useState<SkinToneId>('medium');
  const [modelGender, setModelGender] = useState<ModelGender>('man');
  const [activeModalPartId, setActiveModalPartId] = useState<string | null>(
    null
  );
  const [placementModalOpen, setPlacementModalOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<'body' | 'artwork'>('body');
  const [generating, setGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<
    'idle' | 'processing' | 'success' | 'failed'
  >('idle');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [surpriseIdx, setSurpriseIdx] = useState(0);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [creditPurchaseOpen, setCreditPurchaseOpen] = useState(false);
  const [consultationSize, setConsultationSize] = useState('');
  const [generatedBodyUrl, setGeneratedBodyUrl] = useState<string | null>(null);
  const [generatedArtUrl, setGeneratedArtUrl] = useState<string | null>(null);
  const [stencilSize, setStencilSize] = useState('medium');
  const draftRestoredRef = useRef(false);
  const generatingRef = useRef(false);

  // Restore the draft only after the session settles, so a signed-in user's
  // anonymous draft (saved before login) is not rejected. Never auto-generate.
  useEffect(() => {
    if (sessionPending || draftRestoredRef.current) return;
    draftRestoredRef.current = true;
    const draft = readTattooDraft(session?.user?.id);
    if (!draft) return;
    if (!initialPrompt && draft.prompt) setPrompt(draft.prompt);
    if (!initialStyle && ALL_STYLES.some((s) => s.id === draft.style)) {
      setSelectedStyle(draft.style);
      setShowAllStyles(EXTRA_STYLES.some((s) => s.id === draft.style));
    }
    if (draft.placement) {
      setPlacement(draft.placement);
      setSkinTone(draft.placement.skinTone);
      setModelGender(draft.placement.model);
    } else {
      if (draft.skinTone) setSkinTone(draft.skinTone);
      if (draft.model) setModelGender(draft.model);
    }
    if (draft.stencilSize) setStencilSize(draft.stencilSize);
    if (draft.openStep) setOpenStep(draft.openStep);
    if (draft.previewTab) setPreviewTab(draft.previewTab);
  }, [initialPrompt, initialStyle, session?.user?.id, sessionPending]);

  // Debounced sessionStorage draft. The owner is anonymous before login and
  // becomes the user id afterwards, so returning from sign-in still restores.
  useEffect(() => {
    if (sessionPending || !draftRestoredRef.current) return;
    const timer = window.setTimeout(() => {
      const draft: TattooDraft = {
        v: 1,
        ownerId: ownerIdOf(session?.user?.id),
        updatedAt: Date.now(),
        prompt,
        style: selectedStyle,
        placement,
        skinTone,
        model: modelGender,
        stencilSize,
        openStep,
        previewTab,
      };
      writeSessionJson(DRAFT_KEY, draft);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [
    modelGender,
    openStep,
    placement,
    previewTab,
    prompt,
    selectedStyle,
    session?.user?.id,
    sessionPending,
    skinTone,
    stencilSize,
  ]);

  const visibleStyles = showAllStyles ? ALL_STYLES : PRIMARY_STYLES;
  const activeStyleObj =
    ALL_STYLES.find((s) => s.id === selectedStyle) ?? PRIMARY_STYLES[0];
  const activePlacementPart = placement
    ? BODY_PARTS.find((p) => p.id === placement.partId)
    : null;
  const activePlacementView =
    activePlacementPart && placement
      ? activePlacementPart.views.find((v) => v.id === placement.viewId)
      : null;
  const placementSummary = activePlacementPart
    ? [
        activePlacementPart.label(),
        activePlacementPart.views.length > 1 && activePlacementView
          ? activePlacementView.label()
          : null,
        placement && placement.points.length >= 3
          ? m['home.placement.custom_area_tag']()
          : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : null;

  const ideas = [
    m['home.hero.idea1'](),
    m['home.hero.idea2'](),
    m['home.hero.idea3'](),
  ];

  function handleSurprise() {
    const next = ideas[surpriseIdx % ideas.length];
    setPrompt(next);
    setSurpriseIdx((i) => i + 1);
  }

  function applyTaskResult(task: {
    id?: string;
    taskId?: string;
    tier: string;
    imageUrl: string | null;
    artworkUrl?: string | null;
    hasArtwork?: boolean;
    artworkError?: string | null;
  }) {
    if (!task.imageUrl) return;
    if (task.tier === 'clean_artwork' || task.tier === 'stencil_from_preview') {
      setGeneratedArtUrl(task.imageUrl);
      setPreviewTab('artwork');
    } else {
      setGeneratedBodyUrl(task.imageUrl);
      if (task.artworkUrl) {
        setGeneratedArtUrl(task.artworkUrl);
        setPreviewTab('artwork');
      } else {
        setPreviewTab('body');
      }
    }
  }

  async function runGeneration(
    tier: TattooGenerationTier,
    promptOverride?: string,
    sourceTaskId?: string
  ) {
    // Auth is still restoring after a redirect; do not treat the user as
    // signed out and reopen the sign-in modal.
    if (sessionPending) return;
    if (!session?.user) {
      // Flush the draft before leaving for sign-in; the debounce may not have
      // fired yet, and the callback returns with a full page load.
      writeSessionJson(DRAFT_KEY, {
        v: 1,
        ownerId: 'anonymous',
        updatedAt: Date.now(),
        prompt,
        style: selectedStyle,
        placement,
        skinTone,
        model: modelGender,
        stencilSize,
        openStep,
        previewTab,
      } satisfies TattooDraft);
      onOpenAuth?.();
      return;
    }
    const generationPrompt = promptOverride ?? prompt.trim();
    if (!generationPrompt) {
      setOpenStep(2);
      toast.info(m['home.hero.need_prompt']());
      return;
    }
    if (
      tier !== 'clean_artwork' &&
      tier !== 'stencil_from_preview' &&
      (!placement || placement.points.length < 3)
    ) {
      setOpenStep(3);
      toast.info(m['home.hero.need_placement']());
      return;
    }

    if (generatingRef.current) return;
    generatingRef.current = true;

    const requestSignature = JSON.stringify({
      tier,
      autoStencil: tier === 'fast_body_preview' && !stencilMode,
      prompt: generationPrompt,
      sourceTaskId: sourceTaskId ?? null,
      style: selectedStyle,
      placement: placement
        ? {
            partId: placement.partId,
            viewId: placement.viewId,
            model: placement.model,
            skinTone: placement.skinTone,
            points: placement.points,
          }
        : null,
    });
    const ownerId = ownerIdOf(session.user.id);
    const pending = readSessionJson<PendingRequest>(PENDING_REQUEST_KEY);
    const requestId =
      pending &&
      pending.ownerId === ownerId &&
      pending.signature === requestSignature &&
      Date.now() - pending.updatedAt < PENDING_REQUEST_TTL_MS
        ? pending.id
        : crypto.randomUUID();
    writeSessionJson(PENDING_REQUEST_KEY, {
      id: requestId,
      ownerId,
      signature: requestSignature,
      updatedAt: Date.now(),
    } satisfies PendingRequest);

    const controller = new AbortController();
    const timeoutTimer = window.setTimeout(() => controller.abort(), 180_000);

    setGenerating(true);
    setGenerationStatus('processing');
    setGenerationError(null);
    setActiveTaskId(null);
    if (tier === 'clean_artwork' || tier === 'stencil_from_preview') {
      setGeneratedArtUrl(null);
    } else {
      setGeneratedBodyUrl(null);
      setGeneratedArtUrl(null);
    }
    removeSessionValue(ACTIVE_TASK_KEY);

    try {
      const referenceImage = placement
        ? new URL(
            getBodyReferenceSrc(
              placement.partId,
              placement.viewId,
              placement.skinTone
            ),
            window.location.origin
          ).toString()
        : undefined;

      let placementPayload = placement
        ? {
            partId: placement.partId,
            viewId: placement.viewId,
            model: placement.model,
            skinTone: placement.skinTone,
            points: placement.points,
          }
        : undefined;
      let placementOverlay: string | undefined;
      // Normalize the lasso against the actual body image. If the browser
      // cannot load it, still send the structured points; never block.
      if (placement) {
        try {
          const built = await buildPlacementReference(placement);
          placementPayload = {
            partId: built.placement.partId,
            viewId: built.placement.viewId,
            model: built.placement.model,
            skinTone: built.placement.skinTone,
            points: built.placement.points,
          };
          placementOverlay = built.markedReference;
        } catch {
          // Fall back to the unadjusted points.
        }
      }

      const res = await apiPost<{
        taskId: string;
        tier: string;
        model: string;
        status: 'processing' | 'success' | 'failed';
        imageUrl: string | null;
        artworkUrl?: string | null;
        hasArtwork?: boolean;
        artworkError?: string | null;
        error?: string;
      }>(
        '/api/tattoo/generate',
        {
          requestId,
          tier,
          prompt: generationPrompt,
          style: selectedStyle,
          placement: placementPayload,
          placementLabel: placementSummary ?? undefined,
          referenceImage,
          placementOverlay,
          sourceTaskId,
          autoStencil: tier === 'fast_body_preview' && !stencilMode,
        },
        { signal: controller.signal }
      );

      if (res.status === 'success' && res.imageUrl) {
        applyTaskResult(res);
        setGenerationStatus('success');
        setGenerating(false);
        setActiveTaskId(null);
        // Persist the finished task too: a refresh restores the same result
        // instead of showing an empty canvas (and tempting a paid retry).
        writeSessionJson(ACTIVE_TASK_KEY, {
          id: res.taskId,
          tier,
          ownerId,
          updatedAt: Date.now(),
        } satisfies ActiveTaskDraft);
        removeSessionValue(PENDING_REQUEST_KEY);
        toast.success(m['home.hero.submitted']());
        return;
      }

      if (res.status === 'processing' && res.taskId) {
        setActiveTaskId(res.taskId);
        setGenerationStatus('processing');
        writeSessionJson(ACTIVE_TASK_KEY, {
          id: res.taskId,
          tier,
          ownerId,
          updatedAt: Date.now(),
        } satisfies ActiveTaskDraft);
        removeSessionValue(PENDING_REQUEST_KEY);
        toast.info(m['home.hero.submitted']());
        return;
      }

      if (res.status === 'failed') {
        const message = res.error || 'Generation failed';
        setGenerationStatus('failed');
        setGenerationError(message);
        setGenerating(false);
        setActiveTaskId(null);
        removeSessionValue(ACTIVE_TASK_KEY);
        removeSessionValue(PENDING_REQUEST_KEY);
        toast.error(message);
        return;
      }

      throw new Error('The AI provider returned no image');
    } catch (err: any) {
      const message =
        err?.name === 'AbortError'
          ? m['home.hero.timeout_hint']()
          : err?.message || 'Generation failed';

      // Credits are authoritative on the server. When the server says the
      // balance is insufficient, preserve the draft and send the user to the
      // pricing page instead of presenting a generation failure.
      if (/insufficient credits/i.test(message)) {
        setGenerating(false);
        setGenerationStatus('idle');
        setGenerationError(null);
        setActiveTaskId(null);
        setCreditPurchaseOpen(true);
        return;
      }

      setGenerationStatus('failed');
      setGenerationError(message);
      setGenerating(false);
      setActiveTaskId(null);
      removeSessionValue(ACTIVE_TASK_KEY);
      // Keep PENDING_REQUEST_KEY: a retry will reuse the same request/task id
      // and cannot charge twice if the server actually finished.
      toast.error(message);
    } finally {
      generatingRef.current = false;
      window.clearTimeout(timeoutTimer);
    }
  }

  // A generated task can outlive the page (Kie is asynchronous). Keep polling
  // our own endpoint; never call the provider from the browser.
  useEffect(() => {
    if (!activeTaskId || generationStatus !== 'processing' || !session?.user) {
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const poll = async () => {
      try {
        const task = await apiGet<{
          id: string;
          status: string;
          tier: string;
          imageUrl: string | null;
          artworkUrl?: string | null;
          hasArtwork?: boolean;
          artworkError?: string | null;
          error: string | null;
        }>(`/api/tattoo/tasks/${encodeURIComponent(activeTaskId)}`);
        if (cancelled) return;

        // The body preview becomes available while its included clean
        // reference extraction is still running.
        if (task.imageUrl) {
          applyTaskResult(task);
        }

        if (task.status === 'success' && task.imageUrl) {
          applyTaskResult(task);
          setGenerationStatus('success');
          setGenerating(false);
          setActiveTaskId(null);
          toast.success(m['home.hero.submitted']());
          return;
        }

        if (task.status === 'failed' || task.status === 'canceled') {
          setGenerationStatus('failed');
          setGenerationError(task.error || 'Generation failed');
          setGenerating(false);
          setActiveTaskId(null);
          removeSessionValue(ACTIVE_TASK_KEY);
          toast.error(task.error || 'Generation failed');
          return;
        }

        timer = window.setTimeout(poll, 3000);
      } catch (err: any) {
        if (cancelled) return;
        const message = err?.message || '';
        if (/not found|unauthorized/i.test(message)) {
          setGenerationStatus('failed');
          setGenerationError(message || 'Generation failed');
          setGenerating(false);
          setActiveTaskId(null);
          removeSessionValue(ACTIVE_TASK_KEY);
          return;
        }
        // A transient network error is not a generation failure; keep polling.
        timer = window.setTimeout(poll, 5000);
      }
    };

    void poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
    // applyTaskResult is derived from setState only; activeTaskId/status drive it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTaskId, generationStatus, session?.user?.id]);

  // Restore the in-flight/last task after a refresh. It only reads the task;
  // it never creates a new one or charges again.
  useEffect(() => {
    if (sessionPending || !session?.user) return;
    const saved = readActiveTask(session.user.id);
    if (!saved) return;
    setActiveTaskId(saved.id);
    setGenerationStatus('processing');
    setGenerating(true);
  }, [session?.user?.id, sessionPending]);

  function handleGenerate() {
    if (stencilMode) {
      if (!prompt.trim()) {
        toast.info(m['home.hero.need_prompt']());
        return;
      }
      const sizeInstruction =
        stencilSize === 'small'
          ? 'designed for a small tattoo, with simple, clear linework'
          : stencilSize === 'large'
            ? 'designed for a large tattoo, with balanced detailed linework'
            : 'designed for a medium-sized tattoo, with readable linework';
      void runGeneration(
        'clean_artwork',
        `${prompt.trim()}, ${sizeInstruction}`
      );
      return;
    }
    void runGeneration('fast_body_preview');
  }

  async function createStencilSvg(): Promise<Blob> {
    if (!generatedArtUrl) throw new Error('Generate line art first.');
    const response = await fetch(generatedArtUrl);
    if (!response.ok) throw new Error('Could not load the generated line art.');
    const imageBlob = await response.blob();
    if (!imageBlob.type.startsWith('image/')) {
      throw new Error('The generated result is not an image.');
    }
    // Trace the bitmap into real outlines so the exported SVG stays sharp at
    // any size. Never fall back to embedding the raster inside an SVG.
    const { svg } = await traceStencilFromBlob(imageBlob);
    return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  }

  async function downloadGeneratedImage(url: string, filename: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Could not load the generated image.');
      const image = await response.blob();
      if (!image.type.startsWith('image/')) {
        throw new Error('The generated result is not an image.');
      }
      const objectUrl = URL.createObjectURL(image);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Image download failed.'
      );
    }
  }

  async function downloadTransparentArtwork() {
    if (!generatedArtUrl) return;
    try {
      const response = await fetch(generatedArtUrl);
      if (!response.ok) throw new Error('Could not load the clean artwork.');
      const source = await response.blob();
      const bitmap = await createImageBitmap(source);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Could not prepare the clean artwork.');
      context.drawImage(bitmap, 0, 0);
      bitmap.close();
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const [red, green, blue] = pixels.data.slice(index, index + 3);
        if (red > 245 && green > 245 && blue > 245) pixels.data[index + 3] = 0;
      }
      context.putImageData(pixels, 0, 0);
      const transparent = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (!transparent) throw new Error('Could not export the clean artwork.');
      const objectUrl = URL.createObjectURL(transparent);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = 'tattoo-clean-reference-art.png';
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Clean artwork export failed.'
      );
    }
  }

  function exportConsultationPdf() {
    if (!generatedBodyUrl || !generatedArtUrl) return;
    const popup = window.open('', '_blank');
    if (!popup) {
      toast.error('Allow pop-ups to export your consultation sheet.');
      return;
    }
    popup.opener = null;
    const escapedPlacement = (placementSummary || 'Placement to be confirmed')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const escapedSize = (
      consultationSize.trim() || 'To be confirmed with artist'
    )
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    popup.document.write(
      `<!doctype html><html><head><title>Tattoo consultation sheet</title><style>@page{size:letter;margin:0.45in}*{box-sizing:border-box}body{margin:0;color:#1f1e1b;font-family:Arial,sans-serif}.eyebrow{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#756f68}.title{margin:6px 0 4px;font-size:25px;letter-spacing:-.04em}.copy{margin:0;color:#615c56;font-size:12px;line-height:1.45}.details{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0}.detail{border:1px solid #dedbd6;border-radius:8px;padding:9px}.detail b{display:block;margin-bottom:3px;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#756f68}.images{display:grid;grid-template-columns:1fr 1fr;gap:12px}.panel{border:1px solid #dedbd6;border-radius:10px;overflow:hidden}.panel h2{margin:0;padding:9px 10px;border-bottom:1px solid #dedbd6;font-size:12px}.panel img{display:block;width:100%;height:275px;object-fit:contain;background:#f8f7f5}.tip{margin-top:14px;border:1px solid #dedbd6;border-radius:8px;padding:10px;font-size:10px;line-height:1.45;color:#615c56}.tip b{color:#1f1e1b}</style></head><body><div class="eyebrow">Artist-friendly reference</div><h1 class="title">Tattoo Consultation Sheet</h1><p class="copy">Bring this to your consultation as a visual starting point. Your artist will adapt it for your skin, placement, and long-term wear.</p><div class="details"><div class="detail"><b>Placement</b>${escapedPlacement}</div><div class="detail"><b>Target size</b>${escapedSize}</div></div><div class="images"><section class="panel"><h2>On-Body Placement Preview</h2><img src="${generatedBodyUrl}" /></section><section class="panel"><h2>Clean Reference Art</h2><img src="${generatedArtUrl}" /></section></div><div class="tip"><b>Artist etiquette tip:</b> Most professional tattoo artists will redraw your reference to ensure the line weight and shading age well on your skin. Share these files as a clear visual starting point—not a rigid blueprint.</div><script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`
    );
    popup.document.close();
  }

  function downloadStencilSvg(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'tattoo-line-art-reference.svg';
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function handleDownloadStencilSvg() {
    try {
      downloadStencilSvg(await createStencilSvg());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'SVG export failed.'
      );
    }
  }

  async function handleShareStencil() {
    try {
      const blob = await createStencilSvg();
      const file = new File([blob], 'tattoo-line-art-reference.svg', {
        type: 'image/svg+xml',
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Tattoo line art reference',
          text: 'Please review this tattoo line art reference.',
        });
      } else {
        downloadStencilSvg(blob);
        const subject = encodeURIComponent('Tattoo line art for review');
        const body = encodeURIComponent(
          'Please review my tattoo line art reference. I have downloaded the SVG file and will attach it to this email.'
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      toast.error(
        error instanceof Error ? error.message : 'Could not share the design.'
      );
    }
  }

  if (stencilMode) {
    const isZh = getLocale() === 'zh';
    const sizeOptions = isZh
      ? [
          ['small', m['tools.stencil.generator_size_small']()],
          ['medium', m['tools.stencil.generator_size_option']()],
          ['large', m['tools.stencil.generator_size_large']()],
        ]
      : [
          ['small', m['tools.stencil.generator_size_small']()],
          ['medium', m['tools.stencil.generator_size_option']()],
          ['large', m['tools.stencil.generator_size_large']()],
        ];

    return (
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-card grid items-start gap-5 rounded-2xl border p-4 shadow-sm sm:p-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold">
                {m['tools.stencil.generator_prompt_label']()}
              </span>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={m['tools.stencil.generator_placeholder']()}
                rows={5}
                className="border-input placeholder:text-muted-foreground focus:border-foreground focus:ring-foreground/10 bg-background w-full resize-y rounded-xl border p-3 text-sm leading-6 outline-none focus:ring-2"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold">
                  {m['tools.stencil.generator_style_label']()}
                </span>
                <select
                  value={selectedStyle}
                  onChange={(event) => setSelectedStyle(event.target.value)}
                  className="border-input bg-background w-full rounded-lg border px-3 py-2.5 text-sm"
                >
                  {ALL_STYLES.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.id === 'fine-line'
                        ? m['tools.stencil.generator_style_option']()
                        : style.label()}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-semibold">
                  {m['tools.stencil.generator_size_label']()}
                </span>
                <select
                  value={stencilSize}
                  onChange={(event) => setStencilSize(event.target.value)}
                  className="border-input bg-background w-full rounded-lg border px-3 py-2.5 text-sm"
                >
                  {sizeOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              disabled={generating || sessionPending}
              onClick={handleGenerate}
              className="bg-foreground text-background hover:bg-foreground/90 flex h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-base font-semibold shadow-sm transition-colors disabled:opacity-60"
            >
              {generating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>
                {generating
                  ? m['tools.stencil.generator_loading']()
                  : m['tools.stencil.generator_button']()}
              </span>
              {showCredits && !generating && (
                <span className="text-background/70 text-xs font-medium">
                  · {TATTOO_GENERATION_COSTS.clean_artwork}{' '}
                  {m['pages.pricing.m021']()}
                </span>
              )}
            </button>
          </div>
          <div className="bg-muted/30 flex min-h-[320px] flex-col rounded-xl border p-3 sm:min-h-[380px] sm:p-4">
            <div
              aria-live="polite"
              className="bg-background flex min-h-[260px] flex-1 items-center justify-center overflow-hidden rounded-lg sm:min-h-[320px]"
            >
              {generationStatus === 'processing' ? (
                <div className="flex flex-col items-center gap-3 px-6 text-center">
                  <Loader2 className="text-foreground size-6 animate-spin" />
                  <p className="text-foreground text-sm font-semibold">
                    {m['home.hero.submitted']()}
                  </p>
                  <p className="text-muted-foreground max-w-xs text-xs leading-5">
                    {m['home.hero.processing_hint']()}
                  </p>
                </div>
              ) : generationStatus === 'failed' ? (
                <div className="flex flex-col items-center gap-3 px-6 text-center">
                  <p className="text-foreground text-sm font-semibold">
                    {m['home.hero.failed_title']()}
                  </p>
                  <p className="text-muted-foreground max-w-xs text-xs leading-5">
                    {generationError || m['home.hero.failed_hint']()}
                  </p>
                  <button
                    type="button"
                    disabled={generating || sessionPending}
                    onClick={handleGenerate}
                    className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold disabled:opacity-60"
                  >
                    <Sparkles className="size-3.5" />
                    <span>{m['tools.stencil.generator_button']()}</span>
                  </button>
                </div>
              ) : generatedArtUrl ? (
                <img
                  src={generatedArtUrl}
                  alt={m['tools.stencil.generator_result_alt']()}
                  className="max-h-[420px] w-full object-contain"
                />
              ) : (
                <p className="text-muted-foreground max-w-xs px-6 text-center text-sm leading-6">
                  {m['tools.stencil.generator_result_empty']()}
                </p>
              )}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                disabled={!generatedArtUrl || generating}
                onClick={() => void handleDownloadStencilSvg()}
                className="border-border bg-background inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="size-4" />
                <span>{m['tools.stencil.generator_download']()}</span>
              </button>
              <button
                type="button"
                disabled={!generatedArtUrl || generating}
                onClick={() => void handleShareStencil()}
                className="border-border bg-background inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Share2 className="size-4" />
                <span>{m['tools.stencil.generator_send']()}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative scroll-mt-20 pt-6 pb-4 md:pt-10 md:pb-6"
    >
      {/* Centered Heading Block */}
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-foreground font-sans text-3xl leading-[1.12] font-bold tracking-[-0.03em] sm:text-4xl lg:text-[44px]">
          {heroTitle ?? m['home.hero.title']()}
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-4xl text-base leading-relaxed sm:text-lg">
          {heroSubtitle ?? m['home.hero.subtitle']()}
        </p>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-5 lg:grid-cols-[520px_minmax(0,1fr)] lg:gap-8 lg:px-8">
        {/* LEFT COLUMN: 3-Step Accordion Builder + CTA */}
        <div className="min-w-0">
          <div className="divide-border border-border divide-y overflow-hidden rounded-2xl border bg-white shadow-xs">
            {/* STEP 1: Choose a tattoo style */}
            <div>
              <button
                type="button"
                onClick={() => setOpenStep(openStep === 1 ? null : 1)}
                className="hover:bg-muted/50 flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="bg-foreground text-background flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    1
                  </span>
                  <div className="border-border size-9 shrink-0 overflow-hidden rounded-lg border bg-white p-1">
                    <img
                      src={activeStyleObj.img}
                      alt={activeStyleObj.label()}
                      width={36}
                      height={36}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-foreground text-sm font-semibold">
                      {m['home.hero.step1_title']()}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {activeStyleObj.label()}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                    openStep === 1 && 'rotate-180'
                  )}
                />
              </button>

              {openStep === 1 && (
                <div className="px-4 pt-1 pb-4">
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {visibleStyles.map((style) => {
                      const active = selectedStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            setSelectedStyle(style.id);
                            setOpenStep(2);
                          }}
                          className={cn(
                            'group relative flex min-w-0 flex-col overflow-hidden rounded-lg border bg-white text-left transition-all',
                            active
                              ? 'border-foreground ring-foreground ring-1'
                              : 'border-border hover:border-foreground/40'
                          )}
                        >
                          <div className="relative aspect-square w-full overflow-hidden bg-white">
                            <img
                              src={style.img}
                              alt={style.label()}
                              width={128}
                              height={128}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                            />
                            {style.isAuto && (
                              <>
                                <span
                                  title={m['home.hero.auto_help']()}
                                  className="text-foreground absolute top-1 left-1 inline-flex items-center gap-1 text-[9px] leading-none font-semibold"
                                >
                                  <span className="bg-foreground text-background flex size-3 items-center justify-center rounded-[3px] text-[8px]">
                                    ✓
                                  </span>
                                  {m['home.hero.auto']()}
                                </span>
                                <HelpCircle className="text-muted-foreground absolute top-1 right-1 size-3" />
                              </>
                            )}
                          </div>
                          <div className="text-foreground flex min-h-[28px] items-center justify-center px-1 py-1 text-center text-[10px] leading-tight font-medium">
                            <span className="line-clamp-2">
                              {style.label()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowAllStyles((v) => !v)}
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium transition-colors"
                    >
                      <ChevronDown
                        className={cn(
                          'size-3.5 transition-transform duration-150',
                          showAllStyles && 'rotate-180'
                        )}
                      />
                      <span>
                        {showAllStyles
                          ? m['home.hero.show_less']()
                          : m['home.hero.show_all_styles']()}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: Describe your idea */}
            <div>
              <button
                type="button"
                onClick={() => setOpenStep(openStep === 2 ? null : 2)}
                className="hover:bg-muted/50 flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="bg-foreground text-background flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    2
                  </span>
                  <div className="min-w-0">
                    <div className="text-foreground text-sm font-semibold">
                      {m['home.hero.step2_title']()}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {prompt.trim() || m['home.hero.step2_hint']()}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                    openStep === 2 && 'rotate-180'
                  )}
                />
              </button>

              {openStep === 2 && (
                <div className="px-5 pt-1 pb-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      promptPlaceholder ?? m['home.hero.prompt_placeholder']()
                    }
                    rows={4}
                    className="border-input text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-foreground/10 w-full resize-none rounded-xl border bg-white p-3 text-sm transition-all outline-none focus:ring-2"
                  />

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-muted-foreground text-xs">
                      {m['home.hero.try_ideas']()}
                    </span>
                    {ideas.map((idea) => (
                      <button
                        key={idea}
                        type="button"
                        onClick={() => setPrompt(idea)}
                        className="border-border text-foreground hover:bg-muted rounded-full border bg-white px-2.5 py-1 text-xs transition-colors"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2.5">
                    <button
                      type="button"
                      onClick={handleSurprise}
                      className="border-border text-foreground hover:bg-muted inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-medium transition-colors"
                    >
                      <Sparkles className="size-3.5" />
                      <span>{m['home.hero.surprise_me']()}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: Choose your placement */}
            <div>
              <button
                type="button"
                onClick={() => setOpenStep(openStep === 3 ? null : 3)}
                className="hover:bg-muted/50 flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="bg-foreground text-background flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    3
                  </span>
                  {openStep !== 3 && placement && activePlacementPart && (
                    <div className="border-border relative size-8 shrink-0 overflow-hidden rounded-md border bg-[#f4f4f5]">
                      <img
                        src={getBodyReferenceSrc(
                          placement.partId,
                          placement.viewId,
                          placement.skinTone
                        )}
                        alt={activePlacementPart.label()}
                        className="size-full object-contain"
                      />
                      {placement.points.length >= 3 && (
                        <svg
                          viewBox="0 0 1000 1000"
                          preserveAspectRatio="none"
                          className="pointer-events-none absolute inset-0 size-full"
                          aria-hidden="true"
                        >
                          <path
                            d={pointsToSvgPath(placement.points, true)}
                            fill="rgba(236, 72, 153, 0.35)"
                            stroke="#ec4899"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-foreground text-sm font-semibold">
                      {m['home.hero.step3_title']()}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {placementSummary || m['home.hero.step3_hint']()}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                    openStep === 3 && 'rotate-180'
                  )}
                />
              </button>

              {openStep === 3 && (
                <div className="px-4 pt-1 pb-4">
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {BODY_PARTS.map((part) => {
                      const isSelected = placement?.partId === part.id;
                      const previewViewId = isSelected
                        ? placement.viewId
                        : part.defaultView;
                      const previewTone = isSelected
                        ? placement.skinTone
                        : skinTone;
                      const drawnPath =
                        isSelected && placement.points.length >= 3
                          ? pointsToSvgPath(placement.points, true)
                          : '';

                      return (
                        <button
                          key={part.id}
                          type="button"
                          onClick={() => {
                            setActiveModalPartId(part.id);
                            setPlacementModalOpen(true);
                          }}
                          className={cn(
                            'group flex min-w-0 cursor-pointer flex-col rounded-xl border bg-white p-2 text-center transition-all',
                            isSelected
                              ? 'border-foreground ring-foreground ring-1'
                              : 'border-border hover:border-foreground/40'
                          )}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#f4f4f5]">
                            <img
                              src={getBodyReferenceSrc(
                                part.id,
                                previewViewId,
                                previewTone
                              )}
                              alt={part.label()}
                              loading="lazy"
                              className="size-full object-contain transition-transform duration-200 group-hover:scale-105"
                            />
                            {drawnPath && (
                              <svg
                                viewBox="0 0 1000 1000"
                                preserveAspectRatio="none"
                                className="pointer-events-none absolute inset-0 size-full"
                                aria-hidden="true"
                              >
                                <path
                                  d={drawnPath}
                                  fill="rgba(236, 72, 153, 0.28)"
                                  stroke="#ec4899"
                                  strokeWidth="1.5"
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-foreground mt-2 line-clamp-1 text-xs font-medium">
                            {part.label()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary Black Generate CTA */}
          <button
            type="button"
            disabled={generating || sessionPending}
            onClick={handleGenerate}
            className="bg-foreground text-background hover:bg-foreground/90 mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-base font-semibold shadow-sm transition-all disabled:opacity-60 sm:text-lg"
          >
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            <span>{m['home.hero.cta']()}</span>
            {showCredits && !generating && (
              <span className="text-background/70 text-xs font-medium">
                · {TATTOO_PREVIEW_PLUS_ARTWORK_COST} {m['pages.pricing.m021']()}
              </span>
            )}
            <ArrowRight className="size-4" />
          </button>
        </div>

        {/* RIGHT COLUMN: Sticky Preview Card with 2 Tabs */}
        <div className="min-w-0 lg:sticky lg:top-20">
          <div className="border-border rounded-2xl border bg-white p-3 shadow-xs sm:p-4">
            {/* 2-Tab Segmented Switcher */}
            <div className="bg-muted mb-3 grid grid-cols-2 gap-1 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setPreviewTab('body')}
                className={cn(
                  'flex flex-col items-center justify-center rounded-md px-2 py-2 text-center transition-all',
                  previewTab === 'body'
                    ? 'text-foreground bg-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="text-xs font-semibold sm:text-sm">
                  {m['home.hero.tab_body']()}
                </span>
                <span className="text-muted-foreground text-[11px]">
                  {m['home.hero.tab_body_hint']()}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTab('artwork')}
                className={cn(
                  'flex flex-col items-center justify-center rounded-md px-2 py-2 text-center transition-all',
                  previewTab === 'artwork'
                    ? 'text-foreground bg-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="text-xs font-semibold sm:text-sm">
                  {m['home.hero.tab_art']()}
                </span>
                <span className="text-muted-foreground text-[11px]">
                  {m['home.hero.tab_art_hint']()}
                </span>
              </button>
            </div>

            {/* Collage Showcase + Centered Clickable Overlay (or Live Generated Result) */}
            <div className="bg-muted/40 relative overflow-hidden rounded-xl">
              {previewTab === 'body' && generatedBodyUrl ? (
                <div className="relative aspect-[16/11] w-full bg-neutral-100 sm:aspect-[4/3]">
                  <img
                    src={generatedBodyUrl}
                    alt={m['home.hero.tab_body']()}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-2.5 bottom-2.5 left-2.5 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={generating || sessionPending}
                      onClick={() => void runGeneration('hq_body_preview')}
                      className="text-foreground inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-xs hover:bg-white disabled:opacity-60"
                    >
                      <Sparkles className="size-3" />
                      <span>{m['pages.home.m001']()}</span>
                      {showCredits && (
                        <span className="text-foreground/60">
                          · {TATTOO_GENERATION_COSTS.hq_body_preview}{' '}
                          {m['pages.pricing.m021']()}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportOpen(true)}
                      className="text-foreground inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-xs hover:bg-white"
                    >
                      <Download className="size-3" />
                      <span>{m['home.hero.export_reference']()}</span>
                    </button>
                  </div>
                </div>
              ) : previewTab === 'artwork' && generatedArtUrl ? (
                <div className="relative aspect-[16/11] w-full bg-white p-4 sm:aspect-[4/3]">
                  <img
                    src={generatedArtUrl}
                    alt={m['home.hero.tab_art']()}
                    className="h-full w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setExportOpen(true)}
                    className="border-border text-foreground absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-full border bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-xs hover:bg-white"
                  >
                    <Download className="size-3" />
                    <span>{m['home.hero.export_reference']()}</span>
                  </button>
                </div>
              ) : generationStatus === 'processing' ? (
                <div
                  aria-live="polite"
                  className="flex aspect-[16/11] w-full flex-col items-center justify-center gap-3 bg-neutral-50 px-6 text-center sm:aspect-[4/3]"
                >
                  <Loader2 className="text-foreground size-7 animate-spin" />
                  <p className="text-foreground text-sm font-semibold">
                    {m['home.hero.submitted']()}
                  </p>
                  <p className="text-muted-foreground max-w-xs text-xs leading-5">
                    {m['home.hero.processing_hint']()}
                  </p>
                </div>
              ) : generationStatus === 'failed' ? (
                <div className="flex aspect-[16/11] w-full flex-col items-center justify-center gap-3 bg-neutral-50 px-6 text-center sm:aspect-[4/3]">
                  <p className="text-foreground text-sm font-semibold">
                    {m['home.hero.failed_title']()}
                  </p>
                  <p className="text-muted-foreground max-w-sm text-xs leading-5">
                    {generationError || m['home.hero.failed_hint']()}
                  </p>
                  <button
                    type="button"
                    disabled={generating || sessionPending}
                    onClick={() => void runGeneration('fast_body_preview')}
                    className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold disabled:opacity-60"
                  >
                    <Sparkles className="size-3.5" />
                    <span>{m['home.hero.cta']()}</span>
                  </button>
                </div>
              ) : previewTab === 'body' ? (
                <div className="w-full">
                  <img
                    src="https://assets.tattoogenerator.online/v1/tattoo-generator/examples/body-preview-collage.jpg"
                    alt={m['home.hero.example_label']()}
                    width={825}
                    height={1024}
                    fetchPriority="high"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </div>
              ) : (
                <div className="grid aspect-[16/11] w-full grid-cols-2 gap-2 bg-neutral-50 p-2 sm:aspect-[4/3]">
                  <div className="border-border/60 overflow-hidden rounded-lg border bg-white">
                    <img
                      src="https://assets.tattoogenerator.online/v2/home-hero-set/dagger-rose-flat-stencil.png"
                      alt={m['home.hero.tab_art']()}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="border-border/60 overflow-hidden rounded-lg border bg-white">
                    <img
                      src="https://assets.tattoogenerator.online/v1/tattoo-how-it-works/clean-artwork.webp"
                      alt={m['home.hero.tab_art']()}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="border-border/60 overflow-hidden rounded-lg border bg-white">
                    <img
                      src="https://assets.tattoogenerator.online/v1/dialog-examples/watercolor-paper.webp"
                      alt={m['home.hero.tab_art']()}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="border-border/60 overflow-hidden rounded-lg border bg-white">
                    <img
                      src="https://assets.tattoogenerator.online/v1/dialog-examples/fox-paper.webp"
                      alt={m['home.hero.tab_art']()}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                </div>
              )}

              {/* Centered Clickable Overlay Card (only when showing example collage) */}
              {!generatedBodyUrl &&
                !generatedArtUrl &&
                generationStatus === 'idle' && (
                  <button
                    type="button"
                    onClick={() => setExamplesOpen(true)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/10 bg-white/95 px-5 py-3 text-center shadow-lg backdrop-blur-md transition-transform hover:scale-[1.02]"
                  >
                    <div className="text-foreground text-sm font-semibold">
                      {m['home.hero.example_label']()}
                    </div>
                    <div className="text-muted-foreground mt-0.5 text-xs">
                      {m['home.hero.example_text']()}
                    </div>
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Customize Body Preview Modal */}
      <BodyPlacementModal
        open={placementModalOpen}
        onOpenChange={setPlacementModalOpen}
        partId={activeModalPartId}
        initialSelection={placement}
        skinTone={skinTone}
        model={modelGender}
        onSkinToneChange={setSkinTone}
        onModelChange={setModelGender}
        onConfirm={(next) => {
          setPlacement(next);
          setOpenStep(null);
        }}
      />

      <Dialog open={creditPurchaseOpen} onOpenChange={setCreditPurchaseOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-0 sm:max-w-5xl">
          <DialogHeader className="border-border border-b px-5 pt-6 pb-5 sm:px-6">
            <DialogTitle className="text-foreground text-xl tracking-tight sm:text-2xl">
              {m['pages.pricing.m015']()}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground max-w-2xl text-sm leading-6">
              {m['pages.pricing.m034']()}
            </DialogDescription>
          </DialogHeader>
          <div className="p-5 sm:p-6">
            <CreditBundlePricing compact onOpenAuth={onOpenAuth} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-0 sm:max-w-2xl">
          <DialogHeader className="border-border border-b px-5 pt-6 pb-5 sm:px-6">
            <DialogTitle className="text-foreground text-xl tracking-tight sm:text-2xl">
              {m['home.hero.export_title']()}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground max-w-xl text-sm leading-6">
              {m['home.hero.export_subtitle']()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 p-5 sm:p-6">
            <section className="border-border grid gap-4 rounded-xl border p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-foreground text-sm font-semibold">
                    {m['home.hero.export_preview_label']()}
                  </h3>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide">
                    {m['home.hero.export_preview_tag']()}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1.5 text-sm leading-5">
                  {m['home.hero.export_preview_description']()}
                </p>
              </div>
              <button
                type="button"
                disabled={!generatedBodyUrl}
                onClick={() =>
                  generatedBodyUrl &&
                  void downloadGeneratedImage(
                    generatedBodyUrl,
                    'tattoo-on-body-preview.png'
                  )
                }
                className="border-border text-foreground hover:bg-muted inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="size-4" />
                {m['home.hero.export_preview_button']()}
              </button>
            </section>

            <section className="border-border grid gap-4 rounded-xl border p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-foreground text-sm font-semibold">
                    {m['home.hero.export_art_label']()}
                  </h3>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide">
                    {m['home.hero.export_art_tag']()}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1.5 text-sm leading-5">
                  {m['home.hero.export_art_description']()}
                </p>
              </div>
              <button
                type="button"
                disabled={!generatedArtUrl}
                onClick={() => void downloadTransparentArtwork()}
                className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="size-4" />
                {m['home.hero.export_art_button']()}
              </button>
            </section>

            <section className="border-border grid gap-4 rounded-xl border p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-foreground text-sm font-semibold">
                    {m['home.hero.export_sheet_label']()}
                  </h3>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide">
                    {m['home.hero.export_sheet_tag']()}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1.5 text-sm leading-5">
                  {m['home.hero.export_sheet_description']()}
                </p>
                <label className="text-muted-foreground mt-3 flex items-center gap-2 text-xs font-medium">
                  {m['home.hero.export_size_label']()}
                  <input
                    value={consultationSize}
                    onChange={(event) =>
                      setConsultationSize(event.target.value)
                    }
                    placeholder={m['home.hero.export_size_placeholder']()}
                    className="border-input bg-background text-foreground h-8 min-w-0 flex-1 rounded-md border px-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  />
                </label>
              </div>
              <button
                type="button"
                disabled={!generatedBodyUrl || !generatedArtUrl}
                onClick={exportConsultationPdf}
                className="border-border text-foreground hover:bg-muted inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileText className="size-4" />
                {m['home.hero.export_sheet_button']()}
              </button>
            </section>

            <aside className="border-border bg-muted/40 rounded-xl border px-4 py-3 text-xs leading-5">
              <span className="text-foreground font-semibold">
                {m['home.hero.export_tip_title']()}
              </span>{' '}
              <span className="text-muted-foreground">
                {m['home.hero.export_tip_body']()}
              </span>
            </aside>
          </div>
        </DialogContent>
      </Dialog>

      {/* Example Designs Lightbox Modal */}
      <Dialog open={examplesOpen} onOpenChange={setExamplesOpen}>
        <DialogContent className="text-foreground max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle>{m['home.hero.example_label']()}</DialogTitle>
          </DialogHeader>
          <div className="overflow-hidden rounded-xl bg-white">
            <img
              src="https://assets.tattoogenerator.online/v1/dialog-examples/example-tattoo-designs.jpg"
              alt={m['home.hero.example_label']()}
              className="h-auto w-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
