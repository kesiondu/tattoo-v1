import { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { apiPost } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';

import { getLocale } from '@/paraglide/runtime.js';
import {
  BODY_PARTS,
  BodyPlacementModal,
  getBodyReferenceSrc,
  pointsToSvgPath,
  type BodyPlacementSelection,
  type ModelGender,
  type SkinToneId,
} from '@/components/body-placement-modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HeroGeneratorProps {
  onOpenAuth?: () => void;
  initialStyle?: string;
  initialPrompt?: string;
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
    img: '/assets/styles/pick-for-me.webp',
    isAuto: true,
  },
  {
    id: 'fine-line',
    label: () => m['home.style.fine_line'](),
    img: '/assets/styles/fine-line.webp',
  },
  {
    id: 'minimalist',
    label: () => m['home.style.minimalist'](),
    img: '/assets/styles/minimalist.webp',
  },
  {
    id: 'lettering',
    label: () => m['home.style.lettering'](),
    img: '/assets/styles/lettering.webp',
  },
  {
    id: 'realism',
    label: () => m['home.style.realism'](),
    img: '/assets/styles/realism.webp',
  },
  {
    id: 'black-grey',
    label: () => m['home.style.black_grey'](),
    img: '/assets/styles/black-grey.webp',
  },
  {
    id: 'american-traditional',
    label: () => m['home.style.american_traditional'](),
    img: '/assets/styles/old-school.webp',
  },
  {
    id: 'japanese',
    label: () => m['home.style.japanese'](),
    img: '/assets/styles/japanese.webp',
  },
  {
    id: 'blackwork',
    label: () => m['home.style.blackwork'](),
    img: '/assets/styles/blackwork.webp',
  },
  {
    id: 'geometric',
    label: () => m['home.style.geometric'](),
    img: '/assets/styles/geometric.webp',
  },
  {
    id: 'neo-traditional',
    label: () => m['home.style.neo_traditional'](),
    img: '/assets/styles/neo-traditional.webp',
  },
  {
    id: 'micro-realism',
    label: () => m['home.style.micro_realism'](),
    img: '/assets/styles/micro-realism.webp',
  },
];

const EXTRA_STYLES: StyleItem[] = [
  {
    id: 'watercolor',
    label: () => m['home.style.watercolor'](),
    img: '/assets/styles/watercolor.webp',
  },
  {
    id: 'tribal',
    label: () => m['home.style.tribal'](),
    img: '/assets/styles/blackwork.webp',
  },
  {
    id: 'cyberpunk',
    label: () => m['home.style.cyberpunk'](),
    img: '/assets/styles/geometric.webp',
  },
  {
    id: 'anime',
    label: () => m['home.style.anime'](),
    img: '/assets/styles/japanese.webp',
  },
  {
    id: 'dotwork',
    label: () => m['home.style.dotwork'](),
    img: '/assets/styles/blackwork.webp',
  },
  {
    id: 'sketch',
    label: () => m['home.style.sketch'](),
    img: '/assets/styles/fine-line.webp',
  },
  {
    id: 'celtic',
    label: () => m['home.style.celtic'](),
    img: '/assets/styles/geometric.webp',
  },
  {
    id: 'trash-polka',
    label: () => m['home.style.trash_polka'](),
    img: '/assets/styles/black-grey.webp',
  },
  {
    id: 'chicano',
    label: () => m['home.style.chicano'](),
    img: '/assets/styles/realism.webp',
  },
  {
    id: 'illustrative',
    label: () => m['home.style.illustrative'](),
    img: '/assets/styles/neo-traditional.webp',
  },
];

const ALL_STYLES = [...PRIMARY_STYLES, ...EXTRA_STYLES];

const EXAMPLE_PAIRS = [
  {
    id: 'watercolor',
    body: '/dialog-examples/watercolor-body.webp',
    art: '/dialog-examples/watercolor-paper.webp',
  },
  {
    id: 'bird',
    body: '/dialog-examples/bird-body.webp',
    art: '/dialog-examples/bird-paper.webp',
  },
  {
    id: 'fox',
    body: '/dialog-examples/fox-body.webp',
    art: '/dialog-examples/fox-paper.webp',
  },
];

export function HeroGenerator({
  onOpenAuth,
  initialStyle,
  initialPrompt,
}: HeroGeneratorProps) {
  const { data: session } = useSession();

  const validInitialStyle =
    initialStyle && ALL_STYLES.some((s) => s.id === initialStyle)
      ? initialStyle
      : 'pick-for-me';
  const [openStep, setOpenStep] = useState<1 | 2 | 3 | null>(
    initialPrompt ? 2 : 1
  );
  const [selectedStyle, setSelectedStyle] = useState<string>(validInitialStyle);
  const [showAllStyles, setShowAllStyles] = useState(
    EXTRA_STYLES.some((s) => s.id === validInitialStyle)
  );
  const [prompt, setPrompt] = useState(initialPrompt ?? '');
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
  const [surpriseIdx, setSurpriseIdx] = useState(0);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [generatedBodyUrl, setGeneratedBodyUrl] = useState<string | null>(null);
  const [generatedArtUrl, setGeneratedArtUrl] = useState<string | null>(null);
  const [activeModelLabel, setActiveModelLabel] = useState<string | null>(null);

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

  async function runGeneration(
    tier: 'fast_body_preview' | 'hq_body_preview' | 'clean_artwork'
  ) {
    if (!session?.user) {
      onOpenAuth?.();
      return;
    }
    if (!prompt.trim()) {
      setOpenStep(2);
      toast.info(m['home.hero.need_prompt']());
      return;
    }
    setGenerating(true);
    try {
      const res = await apiPost<{
        taskId: string;
        tier: string;
        model: string;
        modelLabel: string;
        imageUrl: string | null;
      }>('/api/tattoo/generate', {
        tier,
        prompt: prompt.trim(),
        style: selectedStyle,
        placement: placementSummary ?? undefined,
      });
      setActiveModelLabel(res.modelLabel);
      if (tier === 'clean_artwork') {
        setGeneratedArtUrl(
          res.imageUrl || '/home-values/phoenix-clean-artwork.webp'
        );
        setPreviewTab('artwork');
      } else {
        setGeneratedBodyUrl(
          res.imageUrl || '/home-values/phoenix-body-preview.webp'
        );
        setPreviewTab('body');
      }
      toast.success(`${m['home.hero.submitted']()} · ${res.modelLabel}`);
    } catch (err: any) {
      toast.error(err?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }

  function handleGenerate() {
    void runGeneration('fast_body_preview');
  }

  return (
    <section
      id="hero"
      className="relative scroll-mt-20 pt-6 pb-4 md:pt-10 md:pb-6"
    >
      {/* Centered Heading Block */}
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="font-sans text-3xl leading-[1.12] font-bold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[44px]">
          {m['home.hero.title']()}
        </h1>
        <p className="mx-auto mt-3 max-w-4xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {m['home.hero.subtitle']()}
        </p>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-4 sm:px-6 lg:grid-cols-[520px_minmax(0,1fr)] lg:gap-8 lg:px-8">
        {/* LEFT COLUMN: 3-Step Accordion Builder + CTA */}
        <div className="min-w-0">
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
            {/* STEP 1: Choose a tattoo style */}
            <div>
              <button
                type="button"
                onClick={() => setOpenStep(openStep === 1 ? null : 1)}
                className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    1
                  </span>
                  <div className="size-9 shrink-0 overflow-hidden rounded-lg border border-border bg-white p-1">
                    <img
                      src={activeStyleObj.img}
                      alt={activeStyleObj.label()}
                      className="size-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">
                      {m['home.hero.step1_title']()}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {activeStyleObj.label()}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
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
                              ? 'border-foreground ring-1 ring-foreground'
                              : 'border-border hover:border-foreground/40'
                          )}
                        >
                          <div className="relative aspect-square w-full overflow-hidden bg-white">
                            <img
                              src={style.img}
                              alt={style.label()}
                              className="h-full w-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                            />
                            {style.isAuto && (
                              <>
                                <span
                                  title={m['home.hero.auto_help']()}
                                  className="absolute top-1 left-1 inline-flex items-center gap-1 text-[9px] leading-none font-semibold text-foreground"
                                >
                                  <span className="flex size-3 items-center justify-center rounded-[3px] bg-foreground text-[8px] text-background">
                                    ✓
                                  </span>
                                  {m['home.hero.auto']()}
                                </span>
                                <HelpCircle className="absolute top-1 right-1 size-3 text-muted-foreground" />
                              </>
                            )}
                          </div>
                          <div className="flex min-h-[28px] items-center justify-center px-1 py-1 text-center text-[10px] leading-tight font-medium text-foreground">
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
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
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
                className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    2
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">
                      {m['home.hero.step2_title']()}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {prompt.trim() || m['home.hero.step2_hint']()}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    openStep === 2 && 'rotate-180'
                  )}
                />
              </button>

              {openStep === 2 && (
                <div className="px-5 pt-1 pb-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={m['home.hero.prompt_placeholder']()}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-input bg-white p-3 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                  />

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">
                      {m['home.hero.try_ideas']()}
                    </span>
                    {ideas.map((idea) => (
                      <button
                        key={idea}
                        type="button"
                        onClick={() => setPrompt(idea)}
                        className="rounded-full border border-border bg-white px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2.5">
                    <button
                      type="button"
                      onClick={handleSurprise}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
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
                className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    3
                  </span>
                  {openStep !== 3 && placement && activePlacementPart && (
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-md border border-border bg-[#f4f4f5]">
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
                    <div className="text-sm font-semibold text-foreground">
                      {m['home.hero.step3_title']()}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {placementSummary || m['home.hero.step3_hint']()}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
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
                              ? 'border-foreground ring-1 ring-foreground'
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
                          <span className="mt-2 line-clamp-1 text-xs font-medium text-foreground">
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
            disabled={generating}
            onClick={handleGenerate}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-base font-semibold text-background shadow-sm transition-all hover:bg-foreground/90 disabled:opacity-60 sm:text-lg"
          >
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            <span>{m['home.hero.cta']()}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

        {/* RIGHT COLUMN: Sticky Preview Card with 2 Tabs */}
        <div className="min-w-0 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border bg-white p-3 shadow-xs sm:p-4">
            {/* 2-Tab Segmented Switcher */}
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => setPreviewTab('body')}
                className={cn(
                  'flex flex-col items-center justify-center rounded-md px-2 py-2 text-center transition-all',
                  previewTab === 'body'
                    ? 'bg-white text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="text-xs font-semibold sm:text-sm">
                  {m['home.hero.tab_body']()}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {m['home.hero.tab_body_hint']()}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTab('artwork')}
                className={cn(
                  'flex flex-col items-center justify-center rounded-md px-2 py-2 text-center transition-all',
                  previewTab === 'artwork'
                    ? 'bg-white text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="text-xs font-semibold sm:text-sm">
                  {m['home.hero.tab_art']()}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {m['home.hero.tab_art_hint']()}
                </span>
              </button>
            </div>

            {/* Collage Showcase + Centered Clickable Overlay (or Live Generated Result) */}
            <div className="relative overflow-hidden rounded-xl bg-muted/40">
              {previewTab === 'body' && generatedBodyUrl ? (
                <div className="relative aspect-[16/11] w-full bg-neutral-100 sm:aspect-[4/3]">
                  <img
                    src={generatedBodyUrl}
                    alt={m['home.hero.tab_body']()}
                    className="h-full w-full object-cover"
                  />
                  {activeModelLabel && (
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-xs backdrop-blur-xs">
                      {activeModelLabel}
                    </span>
                  )}
                  <div className="absolute right-2.5 bottom-2.5 left-2.5 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={generating}
                      onClick={() => void runGeneration('hq_body_preview')}
                      className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-xs hover:bg-white disabled:opacity-60"
                    >
                      <Sparkles className="size-3" />
                      <span>
                        {m['pages.home.m001']()}
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={generating}
                      onClick={() => void runGeneration('clean_artwork')}
                      className="inline-flex items-center gap-1 rounded-full bg-foreground/90 px-3 py-1.5 text-xs font-semibold text-background shadow-sm backdrop-blur-xs hover:bg-foreground disabled:opacity-60"
                    >
                      <Sparkles className="size-3" />
                      <span>
                        {m['pages.home.m002']()}
                      </span>
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
                  <span className="absolute top-2.5 left-2.5 rounded-full border border-border bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-xs">
                    Nano Banana Pro
                  </span>
                </div>
              ) : previewTab === 'body' ? (
                <div className="aspect-[16/11] w-full sm:aspect-[4/3]">
                  <img
                    src="/tattoo-generator/examples/body-preview-collage.webp"
                    alt={m['home.hero.example_label']()}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="grid aspect-[16/11] w-full grid-cols-2 gap-2 bg-neutral-50 p-2 sm:aspect-[4/3]">
                  <div className="overflow-hidden rounded-lg border border-border/60 bg-white">
                    <img
                      src="/home-values/phoenix-clean-artwork.webp"
                      alt={m['home.hero.tab_art']()}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border/60 bg-white">
                    <img
                      src="/tattoo-how-it-works/clean-artwork.webp"
                      alt={m['home.hero.tab_art']()}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border/60 bg-white">
                    <img
                      src="/dialog-examples/watercolor-paper.webp"
                      alt={m['home.hero.tab_art']()}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border/60 bg-white">
                    <img
                      src="/dialog-examples/fox-paper.webp"
                      alt={m['home.hero.tab_art']()}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                </div>
              )}

              {/* Centered Clickable Overlay Card (only when showing example collage) */}
              {!generatedBodyUrl && !generatedArtUrl && (
                <button
                  type="button"
                  onClick={() => setExamplesOpen(true)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/10 bg-white/95 px-5 py-3 text-center shadow-lg backdrop-blur-md transition-transform hover:scale-[1.02]"
                >
                  <div className="text-sm font-semibold text-foreground">
                    {m['home.hero.example_label']()}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
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

      {/* Example Designs Lightbox Modal */}
      <Dialog open={examplesOpen} onOpenChange={setExamplesOpen}>
        <DialogContent className="max-w-3xl bg-white text-foreground">
          <DialogHeader>
            <DialogTitle>{m['home.hero.example_label']()}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {EXAMPLE_PAIRS.map((pair) => (
              <div
                key={pair.id}
                className="space-y-2 rounded-xl border border-border bg-neutral-50 p-2"
              >
                <div className="aspect-[2/3] overflow-hidden rounded-lg bg-white">
                  <img
                    src={pair.body}
                    alt={m['home.hero.tab_body']()}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg border border-border/60 bg-white">
                  <img
                    src={pair.art}
                    alt={m['home.hero.tab_art']()}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
