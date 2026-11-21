import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Camera,
  ChevronDown,
  FolderHeart,
  Image as ImageIcon,
  Plus,
  RotateCcw,
  Scan,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { tDynamic } from '@/core/i18n/dynamic';
import { useRouter } from '@/core/i18n/navigation';
import { apiGet } from '@/lib/api-client';
import {
  breadcrumbJsonLd,
  buildSeoHead,
  faqJsonLd,
  webAppJsonLd,
} from '@/lib/seo';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { MarketingPageLayout } from '@/components/marketing-page-layout';
import { SeoRelatedTools } from '@/components/seo-related-tools';
import {
  TryOnSurfaceDemo,
  useTransparentTattooSrc,
} from '@/components/surface-tattoo-demo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BODY_TEMPLATES = [
  {
    id: 'back/back-view',
    en: 'pages.tryon.d001',
    zh: 'pages.tryon.d001',
    x: 50,
    y: 42,
    scale: 36,
  },
  {
    id: 'chest-torso/male-front-torso',
    en: 'pages.tryon.d002',
    zh: 'pages.tryon.d002',
    x: 50,
    y: 40,
    scale: 34,
  },
  {
    id: 'chest-torso/male-side-ribs',
    en: 'pages.tryon.d003',
    zh: 'pages.tryon.d003',
    x: 52,
    y: 48,
    scale: 30,
  },
  {
    id: 'arm/outer-arm',
    en: 'pages.tryon.d004',
    zh: 'pages.tryon.d004',
    x: 50,
    y: 44,
    scale: 26,
  },
  {
    id: 'arm/inner-arm',
    en: 'pages.tryon.d005',
    zh: 'pages.tryon.d005',
    x: 50,
    y: 46,
    scale: 26,
  },
  {
    id: 'leg/front-leg',
    en: 'pages.tryon.d006',
    zh: 'pages.tryon.d006',
    x: 50,
    y: 44,
    scale: 28,
  },
  {
    id: 'leg/back-leg',
    en: 'pages.tryon.d007',
    zh: 'pages.tryon.d007',
    x: 50,
    y: 44,
    scale: 28,
  },
  {
    id: 'leg/outer-leg',
    en: 'pages.tryon.d008',
    zh: 'pages.tryon.d008',
    x: 50,
    y: 44,
    scale: 28,
  },
  {
    id: 'hand/back-of-hand',
    en: 'pages.tryon.d009',
    zh: 'pages.tryon.d009',
    x: 50,
    y: 56,
    scale: 24,
  },
  {
    id: 'hand/palm',
    en: 'pages.tryon.d010',
    zh: 'pages.tryon.d010',
    x: 50,
    y: 58,
    scale: 24,
  },
  {
    id: 'foot-ankle/top-outer-foot-ankle',
    en: 'pages.tryon.d011',
    zh: 'pages.tryon.d011',
    x: 54,
    y: 64,
    scale: 24,
  },
  {
    id: 'neck-ear/front-neck-collarbone',
    en: 'pages.tryon.d012',
    zh: 'pages.tryon.d012',
    x: 50,
    y: 58,
    scale: 28,
  },
  {
    id: 'neck-ear/side-neck-behind-ear',
    en: 'pages.tryon.d013',
    zh: 'pages.tryon.d013',
    x: 52,
    y: 46,
    scale: 24,
  },
  {
    id: 'neck-ear/back-of-neck',
    en: 'pages.tryon.d014',
    zh: 'pages.tryon.d014',
    x: 50,
    y: 48,
    scale: 26,
  },
];

const SKIN_TONES = [
  { id: 'natural-fair', hex: '#EBD1C3' },
  { id: 'warm-ivory', hex: '#E5C0A9' },
  { id: 'medium-light', hex: '#D7BD96' },
  { id: 'medium', hex: '#9F7D54' },
  { id: 'medium-dark', hex: '#815D44' },
  { id: 'dark', hex: '#3A312A' },
];

const TRYON_DRAFT_KEY = 'tattoo:tryon:draft:v1';
const TRYON_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

type TryOnDraft = {
  ownerId: string;
  updatedAt: number;
  designUrl: string | null;
  bodyUrl: string | null;
  activeTemplateId: string | null;
  skinId: string;
  previewMode: '2d' | '3d' | null;
  scale: number;
  rotation: number;
  opacity: number;
  posX: number;
  posY: number;
};

function readTryOnDraft(userId?: string | null): TryOnDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(TRYON_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as TryOnDraft;
    if (!draft?.updatedAt) return null;
    if (Date.now() - draft.updatedAt > TRYON_DRAFT_TTL_MS) {
      window.sessionStorage.removeItem(TRYON_DRAFT_KEY);
      return null;
    }
    const owner = userId || 'anonymous';
    if (draft.ownerId !== 'anonymous' && draft.ownerId !== owner) {
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

function writeTryOnDraft(draft: TryOnDraft) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(TRYON_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Quota/unavailable: mode switching still works in memory.
  }
}

async function uploadToPersistentDataUrl(
  file: File,
  kind: 'design' | 'body'
): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not read the image'));
      img.src = objectUrl;
    });
    const maxSide = kind === 'body' ? 1600 : 1400;
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is unavailable');
    if (kind === 'body') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    // A data URL survives an OAuth full-page redirect (and sessionStorage),
    // unlike a blob URL. WebP keeps design transparency.
    const dataUrl =
      kind === 'design'
        ? canvas.toDataURL('image/webp', 0.9)
        : canvas.toDataURL('image/jpeg', 0.86);
    URL.revokeObjectURL(objectUrl);
    return dataUrl.startsWith('data:image/')
      ? dataUrl
      : canvas.toDataURL('image/png');
  } catch {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(String(reader.result || ''));
      };
      reader.onerror = () => resolve(objectUrl);
      reader.readAsDataURL(file);
    });
  }
}

function TattooTryOnPage() {
  const isZh = getLocale() === 'zh';
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const search = Route.useSearch();
  const initialTattoo =
    search.tattoo && search.tattoo.startsWith('/') ? search.tattoo : null;

  const [designUrl, setDesignUrl] = useState<string | null>(initialTattoo);
  const [bodyUrl, setBodyUrl] = useState<string | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(
    initialTattoo ? 'arm/outer-arm' : null
  );
  const [previewMode, setPreviewMode] = useState<'2d' | '3d' | null>(
    initialTattoo ? '2d' : null
  );
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [skinId, setSkinId] = useState('medium');

  const [scale, setScale] = useState(32);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(86);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(46);
  const [isDragging, setIsDragging] = useState(false);
  const canvasBoxRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeTemplate = activeTemplateId
    ? (BODY_TEMPLATES.find((tpl) => tpl.id === activeTemplateId) ?? null)
    : null;
  const resolvedBodyUrl = activeTemplateId
    ? `/tattoo-generator/body-references/${activeTemplateId}/${skinId}.webp`
    : bodyUrl;
  const transparentDesignUrl = useTransparentTattooSrc(designUrl);

  const hasLiveCanvas = Boolean(designUrl && resolvedBodyUrl && previewMode);
  const is3d = previewMode === '3d';

  const entitlementsQuery = useQuery({
    queryKey: ['user-entitlements', session?.user?.id],
    queryFn: () => apiGet<{ lifetimePro: boolean }>('/api/user/entitlements'),
    enabled: Boolean(session?.user?.id),
    staleTime: 30_000,
  });
  const restoredRef = useRef(false);

  // If Lifetime Pro was removed (refund), the user signed out, or the draft
  // came from another account, never leave the page in a restored 3D state.
  useEffect(() => {
    if (sessionPending || previewMode !== '3d') return;
    const signedOut = !session?.user;
    const proRevoked =
      entitlementsQuery.isSuccess && !entitlementsQuery.data?.lifetimePro;
    if (signedOut || proRevoked) setPreviewMode('2d');
  }, [
    entitlementsQuery.data?.lifetimePro,
    entitlementsQuery.isSuccess,
    previewMode,
    session?.user,
    sessionPending,
  ]);

  // Restore the try-on workspace after login/refresh. Uploads are converted to
  // data URLs so they survive an OAuth full-page redirect; legacy blob URLs
  // cannot outlive the page and are skipped.
  useEffect(() => {
    if (sessionPending || restoredRef.current) return;
    restoredRef.current = true;
    if (initialTattoo) return;
    const draft = readTryOnDraft(session?.user?.id);
    if (!draft) return;
    if (draft.designUrl && !draft.designUrl.startsWith('blob:')) {
      setDesignUrl(draft.designUrl);
    }
    if (draft.activeTemplateId) {
      setActiveTemplateId(draft.activeTemplateId);
    } else if (draft.bodyUrl && !draft.bodyUrl.startsWith('blob:')) {
      setBodyUrl(draft.bodyUrl);
    }
    if (draft.skinId) setSkinId(draft.skinId);
    if (draft.previewMode) setPreviewMode(draft.previewMode);
    if (Number.isFinite(draft.scale)) setScale(draft.scale);
    if (Number.isFinite(draft.rotation)) setRotation(draft.rotation);
    if (Number.isFinite(draft.opacity)) setOpacity(draft.opacity);
    if (Number.isFinite(draft.posX)) setPosX(draft.posX);
    if (Number.isFinite(draft.posY)) setPosY(draft.posY);
  }, [initialTattoo, session?.user?.id, sessionPending]);

  useEffect(() => {
    if (sessionPending || !restoredRef.current) return;
    const timer = window.setTimeout(() => {
      writeTryOnDraft({
        ownerId: session?.user?.id || 'anonymous',
        updatedAt: Date.now(),
        designUrl: designUrl?.startsWith('blob:') ? null : designUrl,
        bodyUrl: bodyUrl?.startsWith('blob:') ? null : bodyUrl,
        activeTemplateId,
        skinId,
        previewMode,
        scale,
        rotation,
        opacity,
        posX,
        posY,
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [
    activeTemplateId,
    bodyUrl,
    designUrl,
    opacity,
    posX,
    posY,
    previewMode,
    rotation,
    scale,
    session?.user?.id,
    sessionPending,
    skinId,
  ]);

  const faqs = [
    { q: m['tryon.faq.q1'](), a: m['tryon.faq.a1']() },
    { q: m['tryon.faq.q2'](), a: m['tryon.faq.a2']() },
    { q: m['tryon.faq.q3'](), a: m['tryon.faq.a3']() },
    { q: m['tryon.faq.q4'](), a: m['tryon.faq.a4']() },
    { q: m['tryon.faq.q5'](), a: m['tryon.faq.a5']() },
    { q: m['tryon.faq.q6'](), a: m['tryon.faq.a6']() },
  ];

  async function handleDesignUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDesignUrl(await uploadToPersistentDataUrl(file, 'design'));
    if (!previewMode) setPreviewMode('2d');
  }

  async function handleBodyUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await uploadToPersistentDataUrl(file, 'body');
    setActiveTemplateId(null);
    setBodyUrl(dataUrl);
    setPosX(50);
    setPosY(46);
    setScale(34);
    setRotation(0);
    if (!previewMode) setPreviewMode('2d');
  }

  function flushTryOnDraftNow() {
    writeTryOnDraft({
      ownerId: session?.user?.id || 'anonymous',
      updatedAt: Date.now(),
      designUrl: designUrl?.startsWith('blob:') ? null : designUrl,
      bodyUrl: bodyUrl?.startsWith('blob:') ? null : bodyUrl,
      activeTemplateId,
      skinId,
      previewMode,
      scale,
      rotation,
      opacity,
      posX,
      posY,
    });
  }

  function selectBodyTemplate(tpl: (typeof BODY_TEMPLATES)[number]) {
    setActiveTemplateId(tpl.id);
    setBodyUrl(`/tattoo-generator/body-references/${tpl.id}/${skinId}.webp`);
    setPosX(tpl.x);
    setPosY(tpl.y);
    setScale(tpl.scale);
    setRotation(0);
    if (!designUrl) {
      setDesignUrl(
        '/tattoo-generator/demo/traditional-swallows-olive-branch.webp'
      );
    }
    if (!previewMode) setPreviewMode('2d');
  }

  function loadDemoPair(mode: '2d' | '3d' = '2d') {
    setDesignUrl(
      '/tattoo-generator/demo/traditional-swallows-olive-branch.webp'
    );
    const demoTpl =
      BODY_TEMPLATES.find((tpl) => tpl.id === 'chest-torso/male-side-ribs') ??
      BODY_TEMPLATES[0];
    setActiveTemplateId(demoTpl.id);
    setBodyUrl(
      `/tattoo-generator/body-references/${demoTpl.id}/${skinId}.webp`
    );
    setPosX(demoTpl.x);
    setPosY(demoTpl.y);
    setScale(demoTpl.scale);
    setRotation(0);
    setPreviewMode(mode);
  }

  function resetTransform() {
    setScale(activeTemplate?.scale ?? 34);
    setRotation(0);
    setOpacity(86);
    setPosX(activeTemplate?.x ?? 50);
    setPosY(activeTemplate?.y ?? 46);
  }

  function handleTattooPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: posX,
      startY: posY,
    };
    setIsDragging(true);
  }

  function handleTattooPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragStateRef.current;
    const box = canvasBoxRef.current;
    if (!drag || drag.pointerId !== e.pointerId || !box) return;
    const rect = box.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dxPct = ((e.clientX - drag.startClientX) / rect.width) * 100;
    const dyPct = ((e.clientY - drag.startClientY) / rect.height) * 100;
    setPosX(Math.min(92, Math.max(8, Math.round(drag.startX + dxPct))));
    setPosY(Math.min(92, Math.max(8, Math.round(drag.startY + dyPct))));
  }

  function handleTattooPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragStateRef.current = null;
    setIsDragging(false);
  }

  return (
    <MarketingPageLayout>
      {({ openAuth }) => (
        <>
          {/* 1. Hero Header (H1) */}
          <section className="pt-7 pb-4 text-center sm:pt-9 sm:pb-5 lg:pt-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h1 className="text-foreground font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
                {m['tryon.hero.h1']()}
              </h1>
              <p className="text-muted-foreground mx-auto mt-3 max-w-3xl text-sm leading-relaxed sm:text-base">
                {m['tryon.hero.subtitle']()}
              </p>
            </div>
          </section>

          {/* 2. Workspace Section (1216px, Left 430px + Right Architectural Grid Canvas) */}
          <section id="tryon-workspace" className="scroll-mt-24 py-5 sm:py-6">
            <div className="mx-auto grid max-w-[1216px] grid-cols-1 items-stretch gap-6 px-4 sm:px-6 lg:grid-cols-[430px_minmax(0,1fr)]">
              {/* Left Sidebar (430px) */}
              <div className="border-border flex flex-col justify-between rounded-xl border bg-white p-5 shadow-2xs lg:min-h-[600px]">
                <div>
                  {/* Header with scan icon + H3 title + subtitle */}
                  <div className="border-border flex items-start gap-3 border-b pb-4">
                    <div className="border-border text-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border bg-white">
                      <Scan className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-foreground text-sm font-semibold">
                        {m['tryon.config.title']()}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {m['tryon.config.subtitle']()}
                      </p>
                    </div>
                  </div>

                  {/* Section 1: Choose a Tattoo Design */}
                  <div className="border-border border-b py-4">
                    <div className="text-foreground mb-3 text-xs font-semibold">
                      {m['tryon.config.s1_title']()}
                    </div>
                    <div className="grid grid-cols-[1fr_148px] items-center gap-3">
                      <div className="border-border flex h-36 flex-col items-center justify-center overflow-hidden rounded-xl border bg-[#fafaf9] p-2 text-center">
                        {designUrl ? (
                          <img
                            src={(transparentDesignUrl ?? designUrl)!}
                            alt="Selected tattoo"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <>
                            <ImageIcon className="text-muted-foreground/70 mb-1.5 size-5" />
                            <span className="text-muted-foreground text-[11px]">
                              {m['tryon.config.s1_empty']()}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="border-border text-foreground hover:bg-muted flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-medium transition-colors">
                          <Upload className="size-3.5 shrink-0" />
                          <span>{m['tryon.config.s1_upload']()}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleDesignUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!session?.user) {
                              flushTryOnDraftNow();
                              openAuth();
                            } else {
                              router.push('/my-designs');
                            }
                          }}
                          className="border-border text-foreground hover:bg-muted flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-medium transition-colors"
                        >
                          <FolderHeart className="size-3.5 shrink-0" />
                          <span>{m['tryon.config.s1_my_designs']()}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Choose a Body Photo */}
                  <div className="py-4">
                    <div className="text-foreground mb-3 text-xs font-semibold">
                      {m['tryon.config.s2_title']()}
                    </div>
                    <div className="grid grid-cols-[1fr_148px] items-center gap-3">
                      <div className="border-border flex h-36 flex-col items-center justify-center overflow-hidden rounded-xl border bg-[#fafaf9] text-center">
                        {resolvedBodyUrl ? (
                          <img
                            src={resolvedBodyUrl}
                            alt="Selected body"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <>
                            <Camera className="text-muted-foreground/70 mb-1.5 size-5" />
                            <span className="text-muted-foreground text-[11px]">
                              {m['tryon.config.s2_empty']()}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="border-border text-foreground hover:bg-muted flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-medium transition-colors">
                          <Upload className="size-3.5 shrink-0" />
                          <span>{m['tryon.config.s2_upload']()}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBodyUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!session?.user) {
                              flushTryOnDraftNow();
                              openAuth();
                            } else {
                              toast.info(m['pages.tryon.m001']());
                            }
                          }}
                          className="border-border text-foreground hover:bg-muted flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-medium transition-colors"
                        >
                          <FolderHeart className="size-3.5 shrink-0" />
                          <span>{m['tryon.config.s2_my_photos']()}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTemplatesOpen(true)}
                          className="border-border text-foreground hover:bg-muted flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-medium transition-colors"
                        >
                          <Scan className="size-3.5 shrink-0" />
                          <span>{m['tryon.config.s2_templates']()}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom 2 Mode Buttons with floating badges + Privacy */}
                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!designUrl && !resolvedBodyUrl) {
                          loadDemoPair('2d');
                          return;
                        }
                        setPreviewMode('2d');
                      }}
                      className={cn(
                        'relative flex cursor-pointer flex-col items-center justify-center rounded-xl px-3 pt-4 pb-2.5 text-center text-white transition-all',
                        previewMode === '2d'
                          ? 'bg-foreground'
                          : 'bg-[#8e8e93] hover:bg-[#78787d]'
                      )}
                    >
                      <span className="bg-foreground text-background absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[9px] font-semibold tracking-wider whitespace-nowrap uppercase">
                        {m['tryon.config.mode_2d_badge']()}
                      </span>
                      <span className="text-xs font-semibold">
                        {m['tryon.config.mode_2d_title']()}
                      </span>
                      <span className="mt-0.5 text-[10px] text-white/80">
                        {m['tryon.config.mode_2d_desc']()}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (sessionPending) return;
                        if (!session?.user) {
                          // A full-page OAuth redirect can discard the
                          // debounced draft; flush it before leaving.
                          flushTryOnDraftNow();
                          openAuth();
                          return;
                        }
                        if (entitlementsQuery.isLoading) {
                          toast.info(m['tryon.config.mode_3d_checking']());
                          return;
                        }
                        if (!entitlementsQuery.data?.lifetimePro) {
                          toast.error(m['tryon.config.mode_3d_locked']());
                          return;
                        }
                        if (!designUrl && !resolvedBodyUrl) {
                          loadDemoPair('3d');
                          return;
                        }
                        setPreviewMode('3d');
                      }}
                      className={cn(
                        'relative flex cursor-pointer flex-col items-center justify-center rounded-xl px-3 pt-4 pb-2.5 text-center text-white transition-all',
                        previewMode === '3d'
                          ? 'bg-foreground'
                          : 'bg-[#8e8e93] hover:bg-[#78787d]'
                      )}
                    >
                      <span className="absolute -top-2.5 right-3 inline-flex items-center gap-0.5 rounded-full bg-neutral-200 px-2 py-0.5 text-[9px] font-semibold text-neutral-800">
                        <Sparkles className="size-2.5" />
                        {m['tryon.config.mode_3d_badge']()}
                      </span>
                      <span className="text-xs font-semibold">
                        {m['tryon.config.mode_3d_title']()}
                      </span>
                      <span className="mt-0.5 text-[10px] text-white/80">
                        {m['tryon.config.mode_3d_desc']()}
                      </span>
                    </button>
                  </div>

                  <div className="text-muted-foreground mt-3 flex items-center justify-center gap-1.5 text-[11px]">
                    <ShieldCheck className="size-3.5 shrink-0" />
                    <span>{m['tryon.config.privacy']()}</span>
                  </div>
                </div>
              </div>

              {/* Right Canvas: Architectural Grid Paper */}
              <div
                className="border-border relative flex min-h-[560px] flex-col items-center justify-center overflow-hidden rounded-xl border bg-[#f7f7f5] p-6 lg:min-h-[600px]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              >
                {hasLiveCanvas ? (
                  <div className="flex w-full max-w-[660px] flex-col items-center gap-4">
                    <div
                      ref={canvasBoxRef}
                      className="border-border relative aspect-[3/4] max-h-[440px] w-full max-w-[360px] overflow-hidden rounded-xl border bg-[#ededed] shadow-sm select-none"
                    >
                      <img
                        src={resolvedBodyUrl!}
                        alt="Body"
                        draggable={false}
                        className="pointer-events-none h-full w-full object-contain"
                      />
                      {/* Alpha-masked & 3D surface-conforming draggable tattoo layer */}
                      <div
                        className="absolute inset-0"
                        style={
                          is3d && activeTemplateId
                            ? {
                                maskImage: `url(${resolvedBodyUrl!})`,
                                WebkitMaskImage: `url(${resolvedBodyUrl!})`,
                                maskSize: 'contain',
                                WebkitMaskSize: 'contain',
                                maskPosition: 'center',
                                WebkitMaskPosition: 'center',
                                maskRepeat: 'no-repeat',
                                WebkitMaskRepeat: 'no-repeat',
                              }
                            : undefined
                        }
                      >
                        <div
                          onPointerDown={handleTattooPointerDown}
                          onPointerMove={handleTattooPointerMove}
                          onPointerUp={handleTattooPointerUp}
                          onPointerCancel={handleTattooPointerUp}
                          className={cn(
                            'absolute cursor-grab touch-none rounded p-0.5 active:cursor-grabbing',
                            isDragging
                              ? 'ring-foreground/45 ring-dashed ring-1'
                              : 'hover:ring-foreground/30 hover:ring-dashed hover:ring-1'
                          )}
                          style={{
                            left: `${posX}%`,
                            top: `${posY}%`,
                            width: `${scale}%`,
                            opacity: opacity / 100,
                            transform: is3d
                              ? `translate(-50%, -50%) perspective(480px) rotateY(${((posX - 50) * 0.65).toFixed(1)}deg) rotateX(${((46 - posY) * 0.25).toFixed(1)}deg) rotateZ(${rotation}deg)`
                              : `translate(-50%, -50%) rotateZ(${rotation}deg)`,
                          }}
                        >
                          <img
                            src={(transparentDesignUrl ?? designUrl)!}
                            alt="Tattoo"
                            draggable={false}
                            className="pointer-events-none block h-auto w-full"
                          />
                        </div>
                      </div>
                      <span className="text-foreground/80 pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium shadow-xs backdrop-blur-xs">
                        {m['pages.tryon.m002']()}
                      </span>
                    </div>

                    {/* Compact Live Transform Bar */}
                    <div className="border-border grid w-full grid-cols-2 gap-3 rounded-xl border bg-white/95 p-3.5 text-xs shadow-xs backdrop-blur-xs sm:grid-cols-5">
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>{m['pages.tryon.m003']()}</span>
                          <span className="text-muted-foreground">
                            {scale}%
                          </span>
                        </span>
                        <input
                          type="range"
                          min={15}
                          max={80}
                          value={scale}
                          onChange={(e) => setScale(Number(e.target.value))}
                          className="accent-foreground w-full"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>{m['pages.tryon.m004']()}</span>
                          <span className="text-muted-foreground">
                            {rotation}°
                          </span>
                        </span>
                        <input
                          type="range"
                          min={-180}
                          max={180}
                          value={rotation}
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="accent-foreground w-full"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>{m['pages.tryon.m005']()}</span>
                          <span className="text-muted-foreground">
                            {opacity}%
                          </span>
                        </span>
                        <input
                          type="range"
                          min={35}
                          max={100}
                          value={opacity}
                          onChange={(e) => setOpacity(Number(e.target.value))}
                          className="accent-foreground w-full"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>X / Y</span>
                          <span className="text-muted-foreground">
                            {posX},{posY}
                          </span>
                        </span>
                        <div className="flex gap-1">
                          <input
                            type="range"
                            min={15}
                            max={85}
                            value={posX}
                            onChange={(e) => setPosX(Number(e.target.value))}
                            className="accent-foreground w-1/2"
                          />
                          <input
                            type="range"
                            min={15}
                            max={85}
                            value={posY}
                            onChange={(e) => setPosY(Number(e.target.value))}
                            className="accent-foreground w-1/2"
                          />
                        </div>
                      </label>
                      <div className="flex items-end justify-end">
                        <button
                          type="button"
                          onClick={resetTransform}
                          className="border-border text-foreground hover:bg-muted inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border bg-white px-2.5 text-xs font-medium"
                        >
                          <RotateCcw className="size-3" />
                          <span>{m['pages.tryon.m006']()}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Default Empty Demo State */
                  <div className="grid w-full max-w-[700px] grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
                    {/* Left column directly on grid canvas: Sample Inputs */}
                    <div className="flex flex-col">
                      <div className="text-muted-foreground mb-3 text-[11px] font-semibold tracking-wider uppercase">
                        {m['tryon.demo.inputs_label']()}
                      </div>

                      <div className="flex flex-1 flex-col items-center justify-between gap-2">
                        {/* Tattoo Artwork card */}
                        <button
                          type="button"
                          onClick={() => loadDemoPair('2d')}
                          className="border-border relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-xs transition-transform hover:scale-[1.01]"
                        >
                          <span className="border-border text-foreground absolute top-2.5 left-2.5 rounded-full border bg-white/95 px-2.5 py-0.5 text-[10px] font-medium shadow-2xs">
                            {m['tryon.demo.tattoo_label']()}
                          </span>
                          <img
                            src="/tattoo-generator/demo/traditional-swallows-olive-branch.webp"
                            alt={m['tryon.demo.tattoo_label']()}
                            className="h-full w-full object-contain pt-3"
                          />
                        </button>

                        {/* Circular + badge */}
                        <button
                          type="button"
                          onClick={() => loadDemoPair('2d')}
                          className="border-border text-foreground flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white shadow-2xs transition-transform hover:scale-105"
                        >
                          <Plus className="size-4" />
                        </button>

                        {/* Body Photo card */}
                        <button
                          type="button"
                          onClick={() => loadDemoPair('2d')}
                          className="border-border relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl border bg-[#efeee9] shadow-xs transition-transform hover:scale-[1.01]"
                        >
                          <span className="border-border text-foreground absolute top-2.5 left-2.5 z-10 rounded-full border bg-white/95 px-2.5 py-0.5 text-[10px] font-medium shadow-2xs">
                            {m['tryon.demo.body_label']()}
                          </span>
                          <img
                            src="/tattoo-generator/body-references/chest-torso/male-side-ribs/medium.webp"
                            alt={m['tryon.demo.body_label']()}
                            className="h-full w-full object-contain"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Right column directly on grid canvas: Live 3D Adjustment Demo */}
                    <div className="flex flex-col">
                      <div className="text-muted-foreground mb-3 text-[11px] font-semibold tracking-wider uppercase">
                        {m['tryon.demo.live_label']()}
                      </div>

                      <TryOnSurfaceDemo onClick={() => loadDemoPair('2d')} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. How It Works (Dark Band) */}
          <section className="border-border border-y bg-neutral-950 py-14 text-white sm:py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8">
              <div>
                <div className="text-xs font-semibold tracking-wider text-white/60 uppercase">
                  {m['tryon.how.eyebrow']()}
                </div>
                <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {m['tryon.how.h2']()}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {m['tryon.how.subtitle']()}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById('tryon-workspace')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="mt-6 inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
                >
                  {m['tryon.how.cta']()}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {[
                  {
                    num: '01',
                    h: m['tryon.how.s1_h3'](),
                    p: m['tryon.how.s1_p'](),
                  },
                  {
                    num: '02',
                    h: m['tryon.how.s2_h3'](),
                    p: m['tryon.how.s2_p'](),
                  },
                  {
                    num: '03',
                    h: m['tryon.how.s3_h3'](),
                    p: m['tryon.how.s3_p'](),
                  },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="rounded-xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="font-mono text-xs font-semibold text-white/50">
                      {step.num}
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-white">
                      {step.h}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {step.p}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <SeoRelatedTools
            items={[
              { href: '/tattoo-ideas', label: m['pages.ideas.m001']() },
              { href: '/tattoo-styles', label: m['pages.styles2.m002']() },
              {
                href: '/tattoo-font-generator',
                label: m['pages.fontgen.m010'](),
              },
              {
                href: '/tattoo-price-calculator',
                label: m['pages.price.m002'](),
              },
            ]}
          />

          {/* 4. FAQ */}
          <section className="py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16 lg:px-8">
              <div>
                <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {m['tryon.faq.eyebrow']()}
                </div>
                <h2 className="text-foreground mt-2 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                  {m['tryon.faq.h2']()}
                </h2>
              </div>

              <div className="divide-border border-border divide-y rounded-2xl border bg-white">
                {faqs.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={item.q}>
                      <h3 className="flex">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="text-foreground hover:bg-muted/40 flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors"
                        >
                          <span>{item.q}</span>
                          <ChevronDown
                            className={cn(
                              'text-muted-foreground size-4 shrink-0 transition-transform',
                              isOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      </h3>
                      {isOpen && (
                        <div className="text-muted-foreground px-5 pb-4 text-sm leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Body Templates Modal (6 skin tones + 14 body areas) */}
          <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
            <DialogContent className="text-foreground max-h-[85vh] max-w-3xl overflow-y-auto bg-white">
              <DialogHeader>
                <div className="flex flex-wrap items-center justify-between gap-3 pr-6">
                  <DialogTitle>{m['tryon.config.s2_templates']()}</DialogTitle>
                  <div className="flex items-center gap-2">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setSkinId(tone.id)}
                        className={cn(
                          'size-4 cursor-pointer rounded-full border border-black/15',
                          skinId === tone.id &&
                            'ring-foreground ring-2 ring-offset-2'
                        )}
                        style={{ backgroundColor: tone.hex }}
                      />
                    ))}
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {BODY_TEMPLATES.map((tpl) => {
                  const url = `/tattoo-generator/body-references/${tpl.id}/${skinId}.webp`;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        selectBodyTemplate(tpl);
                        setTemplatesOpen(false);
                      }}
                      className={cn(
                        'hover:border-foreground cursor-pointer overflow-hidden rounded-xl border bg-white text-center transition-all',
                        activeTemplateId === tpl.id
                          ? 'border-foreground ring-foreground ring-1'
                          : 'border-border'
                      )}
                    >
                      <div className="aspect-[2/3] overflow-hidden bg-[#f4f4f5]">
                        <img
                          src={url}
                          alt={isZh ? tDynamic(tpl.zh) : tDynamic(tpl.en)}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="text-foreground px-1.5 py-2 text-[11px] font-medium">
                        {isZh ? tDynamic(tpl.zh) : tDynamic(tpl.en)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </MarketingPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-try-on')({
  validateSearch: (search: Record<string, unknown>) => ({
    tattoo: typeof search.tattoo === 'string' ? search.tattoo : undefined,
  }),
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['tryon.meta.title']({}, { locale }),
      description: m['tryon.meta.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    const name = title.split(' | ')[0];
    return buildSeoHead({
      title,
      description,
      path: '/tattoo-try-on',
      locale,
      jsonLd: [
        webAppJsonLd({ name, description, path: '/tattoo-try-on', locale }),
        breadcrumbJsonLd(
          [
            {
              name: tDynamic('style_detail.breadcrumb.home', {}, { locale }),
              path: '/',
            },
            { name, path: '/tattoo-try-on' },
          ],
          locale
        ),
        faqJsonLd(
          [1, 2, 3, 4, 5, 6].map((n) => ({
            q: tDynamic(`tryon.faq.q${n}`, {}, { locale }),
            a: tDynamic(`tryon.faq.a${n}`, {}, { locale }),
          }))
        ),
      ],
    });
  },
  component: TattooTryOnPage,
});
