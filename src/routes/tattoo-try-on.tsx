import { useRef, useState } from 'react';
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
import { useRouter } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';
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
  { id: 'back/back-view', en: 'Full Back', zh: '满背', x: 50, y: 42, scale: 36 },
  {
    id: 'chest-torso/male-front-torso',
    en: 'Front Torso',
    zh: '正面躯干',
    x: 50,
    y: 40,
    scale: 34,
  },
  {
    id: 'chest-torso/male-side-ribs',
    en: 'Side Ribs',
    zh: '侧肋骨',
    x: 52,
    y: 48,
    scale: 30,
  },
  {
    id: 'arm/outer-arm',
    en: 'Outer Arm',
    zh: '手臂外侧',
    x: 50,
    y: 44,
    scale: 26,
  },
  {
    id: 'arm/inner-arm',
    en: 'Inner Arm',
    zh: '手臂内侧',
    x: 50,
    y: 46,
    scale: 26,
  },
  {
    id: 'leg/front-leg',
    en: 'Front Leg',
    zh: '腿部前侧',
    x: 50,
    y: 44,
    scale: 28,
  },
  {
    id: 'leg/back-leg',
    en: 'Back Leg',
    zh: '腿部后侧',
    x: 50,
    y: 44,
    scale: 28,
  },
  {
    id: 'leg/outer-leg',
    en: 'Outer Leg',
    zh: '腿部外侧',
    x: 50,
    y: 44,
    scale: 28,
  },
  {
    id: 'hand/back-of-hand',
    en: 'Back of Hand',
    zh: '手背',
    x: 50,
    y: 56,
    scale: 24,
  },
  { id: 'hand/palm', en: 'Palm', zh: '手掌', x: 50, y: 58, scale: 24 },
  {
    id: 'foot-ankle/top-outer-foot-ankle',
    en: 'Foot & Ankle',
    zh: '脚背与脚踝',
    x: 54,
    y: 64,
    scale: 24,
  },
  {
    id: 'neck-ear/front-neck-collarbone',
    en: 'Collarbone',
    zh: '颈前与锁骨',
    x: 50,
    y: 58,
    scale: 28,
  },
  {
    id: 'neck-ear/side-neck-behind-ear',
    en: 'Behind Ear',
    zh: '颈侧与耳后',
    x: 52,
    y: 46,
    scale: 24,
  },
  {
    id: 'neck-ear/back-of-neck',
    en: 'Back of Neck',
    zh: '后颈',
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

function TattooTryOnPage() {
  const isZh = getLocale() === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const { data: session } = useSession();
  const router = useRouter();

  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [bodyUrl, setBodyUrl] = useState<string | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'2d' | '3d' | null>(null);
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

  const faqs = [
    { q: m['tryon.faq.q1'](), a: m['tryon.faq.a1']() },
    { q: m['tryon.faq.q2'](), a: m['tryon.faq.a2']() },
    { q: m['tryon.faq.q3'](), a: m['tryon.faq.a3']() },
    { q: m['tryon.faq.q4'](), a: m['tryon.faq.a4']() },
    { q: m['tryon.faq.q5'](), a: m['tryon.faq.a5']() },
    { q: m['tryon.faq.q6'](), a: m['tryon.faq.a6']() },
  ];

  function handleDesignUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDesignUrl(URL.createObjectURL(file));
    if (!previewMode) setPreviewMode('2d');
  }

  function handleBodyUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setActiveTemplateId(null);
    setBodyUrl(URL.createObjectURL(file));
    setPosX(50);
    setPosY(46);
    setScale(34);
    setRotation(0);
    if (!previewMode) setPreviewMode('2d');
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
    <InkStudioPageLayout>
      {({ openAuth }) => (
        <>
          {/* 1. Hero Header (H1) */}
          <section className="pt-7 pb-4 text-center sm:pt-9 sm:pb-5 lg:pt-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {m['tryon.hero.h1']()}
              </h1>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {m['tryon.hero.subtitle']()}
              </p>
            </div>
          </section>

          {/* 2. Workspace Section (1216px, Left 430px + Right Architectural Grid Canvas) */}
          <section id="tryon-workspace" className="scroll-mt-24 py-5 sm:py-6">
            <div className="mx-auto grid max-w-[1216px] grid-cols-1 items-stretch gap-6 px-4 sm:px-6 lg:grid-cols-[430px_minmax(0,1fr)]">
              {/* Left Sidebar (430px) */}
              <div className="flex flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-2xs lg:min-h-[600px]">
                <div>
                  {/* Header with scan icon + H3 title + subtitle */}
                  <div className="flex items-start gap-3 border-b border-border pb-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-foreground">
                      <Scan className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {m['tryon.config.title']()}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {m['tryon.config.subtitle']()}
                      </p>
                    </div>
                  </div>

                  {/* Section 1: Choose a Tattoo Design */}
                  <div className="border-b border-border py-4">
                    <div className="mb-3 text-xs font-semibold text-foreground">
                      {m['tryon.config.s1_title']()}
                    </div>
                    <div className="grid grid-cols-[1fr_148px] items-center gap-3">
                      <div className="flex h-36 flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-[#fafaf9] p-2 text-center">
                        {designUrl ? (
                          <img
                            src={(transparentDesignUrl ?? designUrl)!}
                            alt="Selected tattoo"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <>
                            <ImageIcon className="mb-1.5 size-5 text-muted-foreground/70" />
                            <span className="text-[11px] text-muted-foreground">
                              {m['tryon.config.s1_empty']()}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted">
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
                              openAuth();
                            } else {
                              router.push('/my-designs');
                            }
                          }}
                          className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <FolderHeart className="size-3.5 shrink-0" />
                          <span>{m['tryon.config.s1_my_designs']()}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Choose a Body Photo */}
                  <div className="py-4">
                    <div className="mb-3 text-xs font-semibold text-foreground">
                      {m['tryon.config.s2_title']()}
                    </div>
                    <div className="grid grid-cols-[1fr_148px] items-center gap-3">
                      <div className="flex h-36 flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-[#fafaf9] text-center">
                        {resolvedBodyUrl ? (
                          <img
                            src={resolvedBodyUrl}
                            alt="Selected body"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <>
                            <Camera className="mb-1.5 size-5 text-muted-foreground/70" />
                            <span className="text-[11px] text-muted-foreground">
                              {m['tryon.config.s2_empty']()}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted">
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
                              openAuth();
                            } else {
                              toast.info(
                                t(
                                  'No saved body photos yet',
                                  '暂无已保存的身体照片'
                                )
                              );
                            }
                          }}
                          className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <FolderHeart className="size-3.5 shrink-0" />
                          <span>{m['tryon.config.s2_my_photos']()}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTemplatesOpen(true)}
                          className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
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
                      onClick={() => loadDemoPair('2d')}
                      className={cn(
                        'relative flex cursor-pointer flex-col items-center justify-center rounded-xl px-3 pt-4 pb-2.5 text-center text-white transition-all',
                        previewMode === '2d'
                          ? 'bg-foreground'
                          : 'bg-[#8e8e93] hover:bg-[#78787d]'
                      )}
                    >
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-2.5 py-0.5 text-[9px] font-semibold tracking-wider whitespace-nowrap text-background uppercase">
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
                        if (!session?.user) {
                          openAuth();
                          return;
                        }
                        loadDemoPair('3d');
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

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck className="size-3.5 shrink-0" />
                    <span>{m['tryon.config.privacy']()}</span>
                  </div>
                </div>
              </div>

              {/* Right Canvas: Architectural Grid Paper */}
              <div
                className="relative flex min-h-[560px] flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-[#f7f7f5] p-6 lg:min-h-[600px]"
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
                      className="relative aspect-[3/4] max-h-[440px] w-full max-w-[360px] overflow-hidden rounded-xl border border-border bg-[#ededed] shadow-sm select-none"
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
                          activeTemplateId
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
                            'absolute touch-none cursor-grab rounded p-0.5 active:cursor-grabbing',
                            isDragging
                              ? 'ring-1 ring-foreground/45 ring-dashed'
                              : 'hover:ring-1 hover:ring-foreground/30 hover:ring-dashed'
                          )}
                          style={{
                            left: `${posX}%`,
                            top: `${posY}%`,
                            width: `${scale}%`,
                            opacity: opacity / 100,
                            transform: `translate(-50%, -50%) perspective(480px) rotateY(${((posX - 50) * 0.65).toFixed(1)}deg) rotateX(${((46 - posY) * 0.25).toFixed(1)}deg) rotateZ(${rotation}deg)`,
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
                      <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium text-foreground/80 shadow-xs backdrop-blur-xs">
                        {t('Drag tattoo to move', '拖动纹身可调整位置')}
                      </span>
                    </div>

                    {/* Compact Live Transform Bar */}
                    <div className="grid w-full grid-cols-2 gap-3 rounded-xl border border-border bg-white/95 p-3.5 text-xs shadow-xs backdrop-blur-xs sm:grid-cols-5">
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>{t('Size', '大小')}</span>
                          <span className="text-muted-foreground">{scale}%</span>
                        </span>
                        <input
                          type="range"
                          min={15}
                          max={80}
                          value={scale}
                          onChange={(e) => setScale(Number(e.target.value))}
                          className="w-full accent-foreground"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>{t('Rotate', '旋转')}</span>
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
                          className="w-full accent-foreground"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>{t('Blend', '融合')}</span>
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
                          className="w-full accent-foreground"
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
                            className="w-1/2 accent-foreground"
                          />
                          <input
                            type="range"
                            min={15}
                            max={85}
                            value={posY}
                            onChange={(e) => setPosY(Number(e.target.value))}
                            className="w-1/2 accent-foreground"
                          />
                        </div>
                      </label>
                      <div className="flex items-end justify-end">
                        <button
                          type="button"
                          onClick={resetTransform}
                          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-border bg-white px-2.5 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          <RotateCcw className="size-3" />
                          <span>{t('Reset', '重置')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Default Empty Demo State */
                  <div className="grid w-full max-w-[700px] grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
                    {/* Left column directly on grid canvas: Sample Inputs */}
                    <div className="flex flex-col">
                      <div className="mb-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {m['tryon.demo.inputs_label']()}
                      </div>

                      <div className="flex flex-1 flex-col items-center justify-between gap-2">
                        {/* Tattoo Artwork card */}
                        <button
                          type="button"
                          onClick={() => loadDemoPair('2d')}
                          className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-white p-4 shadow-xs transition-transform hover:scale-[1.01]"
                        >
                          <span className="absolute top-2.5 left-2.5 rounded-full border border-border bg-white/95 px-2.5 py-0.5 text-[10px] font-medium text-foreground shadow-2xs">
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
                          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-foreground shadow-2xs transition-transform hover:scale-105"
                        >
                          <Plus className="size-4" />
                        </button>

                        {/* Body Photo card */}
                        <button
                          type="button"
                          onClick={() => loadDemoPair('2d')}
                          className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-[#efeee9] shadow-xs transition-transform hover:scale-[1.01]"
                        >
                          <span className="absolute top-2.5 left-2.5 z-10 rounded-full border border-border bg-white/95 px-2.5 py-0.5 text-[10px] font-medium text-foreground shadow-2xs">
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
                      <div className="mb-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
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
          <section className="border-y border-border bg-neutral-950 py-14 text-white sm:py-20">
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

          {/* 4. FAQ */}
          <section className="py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16 lg:px-8">
              <div>
                <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {m['tryon.faq.eyebrow']()}
                </div>
                <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {m['tryon.faq.h2']()}
                </h2>
              </div>

              <div className="divide-y divide-border rounded-2xl border border-border bg-white">
                {faqs.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={item.q}>
                      <h3 className="flex">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                        >
                          <span>{item.q}</span>
                          <ChevronDown
                            className={cn(
                              'size-4 shrink-0 text-muted-foreground transition-transform',
                              isOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      </h3>
                      {isOpen && (
                        <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
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
            <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto bg-white text-foreground">
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
                            'ring-2 ring-foreground ring-offset-2'
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
                        'cursor-pointer overflow-hidden rounded-xl border bg-white text-center transition-all hover:border-foreground',
                        activeTemplateId === tpl.id
                          ? 'border-foreground ring-1 ring-foreground'
                          : 'border-border'
                      )}
                    >
                      <div className="aspect-[2/3] overflow-hidden bg-[#f4f4f5]">
                        <img
                          src={url}
                          alt={isZh ? tpl.zh : tpl.en}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="px-1.5 py-2 text-[11px] font-medium text-foreground">
                        {isZh ? tpl.zh : tpl.en}
                      </div>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-try-on')({
  loader: () => {
    const locale = getLocale();
    return {
      title: m['tryon.meta.title']({}, { locale }),
      description: m['tryon.meta.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.title },
          { name: 'description', content: loaderData.description },
        ]
      : [],
  }),
  component: TattooTryOnPage,
});
