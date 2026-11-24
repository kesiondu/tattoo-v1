import { useEffect, useRef, useState } from 'react';
import { HelpCircle, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type ModelGender = 'man' | 'woman';

export type SkinToneId =
  | 'natural-fair'
  | 'warm-ivory'
  | 'medium-light'
  | 'medium'
  | 'medium-dark'
  | 'dark';

export interface NormalizedPoint {
  x: number; // 0..1
  y: number; // 0..1
}

export interface BodyViewDef {
  id: string;
  label: () => string;
}

export interface BodyPartDef {
  id: string;
  label: () => string;
  defaultView: string;
  views: BodyViewDef[];
}

export interface BodyPlacementSelection {
  partId: string;
  viewId: string;
  model: ModelGender;
  skinTone: SkinToneId;
  points: NormalizedPoint[];
}

export const SKIN_TONES: { id: SkinToneId; name: string; color: string }[] = [
  { id: 'natural-fair', name: 'Natural Fair', color: '#EBD1C3' },
  { id: 'warm-ivory', name: 'Warm Ivory', color: '#E5C0A9' },
  { id: 'medium-light', name: 'Medium Light', color: '#D7BD96' },
  { id: 'medium', name: 'Medium', color: '#9F7D54' },
  { id: 'medium-dark', name: 'Medium Dark', color: '#815D44' },
  { id: 'dark', name: 'Dark', color: '#3A312A' },
];

export const BODY_PARTS: BodyPartDef[] = [
  {
    id: 'back',
    label: () => m['home.placement.back'](),
    defaultView: 'back-view',
    views: [
      { id: 'back-view', label: () => m['home.placement.view.back_view']() },
    ],
  },
  {
    id: 'chest-torso',
    label: () => m['home.placement.chest_torso'](),
    defaultView: 'male-front-torso',
    views: [
      {
        id: 'male-front-torso',
        label: () => m['home.placement.view.front_torso'](),
      },
      {
        id: 'male-side-ribs',
        label: () => m['home.placement.view.side_ribs'](),
      },
    ],
  },
  {
    id: 'arm',
    label: () => m['home.placement.arm'](),
    defaultView: 'outer-arm',
    views: [
      { id: 'outer-arm', label: () => m['home.placement.view.outer_arm']() },
      { id: 'inner-arm', label: () => m['home.placement.view.inner_arm']() },
    ],
  },
  {
    id: 'leg',
    label: () => m['home.placement.leg'](),
    defaultView: 'front-leg',
    views: [
      { id: 'front-leg', label: () => m['home.placement.view.front_leg']() },
      { id: 'back-leg', label: () => m['home.placement.view.back_leg']() },
      { id: 'outer-leg', label: () => m['home.placement.view.outer_leg']() },
    ],
  },
  {
    id: 'hand',
    label: () => m['home.placement.hand'](),
    defaultView: 'back-of-hand',
    views: [
      {
        id: 'back-of-hand',
        label: () => m['home.placement.view.back_of_hand'](),
      },
      { id: 'palm', label: () => m['home.placement.view.palm']() },
    ],
  },
  {
    id: 'foot-ankle',
    label: () => m['home.placement.foot_ankle'](),
    defaultView: 'top-outer-foot-ankle',
    views: [
      {
        id: 'top-outer-foot-ankle',
        label: () => m['home.placement.view.top_outer_foot_ankle'](),
      },
    ],
  },
  {
    id: 'neck-ear',
    label: () => m['home.placement.neck_ear'](),
    defaultView: 'front-neck-collarbone',
    views: [
      {
        id: 'front-neck-collarbone',
        label: () => m['home.placement.view.front_neck_collarbone'](),
      },
      {
        id: 'side-neck-behind-ear',
        label: () => m['home.placement.view.side_neck_behind_ear'](),
      },
      {
        id: 'back-of-neck',
        label: () => m['home.placement.view.back_of_neck'](),
      },
    ],
  },
];

export function getBodyReferenceSrc(
  partId: string,
  viewId: string,
  skinTone: SkinToneId
) {
  return `https://assets.tattoogenerator.online/v1/tattoo-generator/body-references/${partId}/${viewId}/${skinTone}.webp`;
}

export function pointsToSvgPath(
  points: NormalizedPoint[],
  closed: boolean
): string {
  if (points.length < 2) return '';
  const parts = points.map(
    (p, idx) =>
      `${idx === 0 ? 'M' : 'L'} ${(p.x * 1000).toFixed(1)} ${(p.y * 1000).toFixed(1)}`
  );
  if (closed && points.length >= 3) {
    parts.push('Z');
  }
  return parts.join(' ');
}

interface BodyPlacementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partId: string | null;
  initialSelection: BodyPlacementSelection | null;
  skinTone: SkinToneId;
  model: ModelGender;
  onSkinToneChange: (tone: SkinToneId) => void;
  onModelChange: (model: ModelGender) => void;
  onConfirm: (selection: BodyPlacementSelection) => void;
}

export function BodyPlacementModal({
  open,
  onOpenChange,
  partId,
  initialSelection,
  skinTone,
  model,
  onSkinToneChange,
  onModelChange,
  onConfirm,
}: BodyPlacementModalProps) {
  const part = BODY_PARTS.find((p) => p.id === partId) ?? BODY_PARTS[0];

  const [viewId, setViewId] = useState<string>(part.defaultView);
  const [points, setPoints] = useState<NormalizedPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open || !partId) return;
    const targetPart = BODY_PARTS.find((p) => p.id === partId) ?? BODY_PARTS[0];
    if (initialSelection && initialSelection.partId === targetPart.id) {
      setViewId(initialSelection.viewId);
      setPoints(initialSelection.points);
    } else {
      setViewId(targetPart.defaultView);
      setPoints([]);
    }
    setIsDrawing(false);
    activePointerIdRef.current = null;
  }, [open, partId, initialSelection]);

  const hasCustomArea = points.length >= 3 && !isDrawing;
  const imgSrc = getBodyReferenceSrc(part.id, viewId, skinTone);

  function getNormalizedPoint(
    clientX: number,
    clientY: number
  ): NormalizedPoint | null {
    const el = canvasRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    return { x, y };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const pt = getNormalizedPoint(e.clientX, e.clientY);
    if (!pt) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    activePointerIdRef.current = e.pointerId;
    setIsDrawing(true);
    setPoints([pt]);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDrawing || activePointerIdRef.current !== e.pointerId) return;
    const pt = getNormalizedPoint(e.clientX, e.clientY);
    if (!pt) return;
    setPoints((prev) => {
      const last = prev[prev.length - 1];
      if (last) {
        const dx = pt.x - last.x;
        const dy = pt.y - last.y;
        if (dx * dx + dy * dy < 0.00004) return prev;
      }
      return [...prev, pt];
    });
  }

  function finishDrawing(e: React.PointerEvent<HTMLDivElement>) {
    if (activePointerIdRef.current !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    activePointerIdRef.current = null;
    setIsDrawing(false);
    setPoints((prev) => (prev.length >= 3 ? prev : []));
  }

  function handleViewSwitch(nextViewId: string) {
    if (nextViewId === viewId) return;
    setViewId(nextViewId);
    setPoints([]);
    setIsDrawing(false);
  }

  function handleConfirm() {
    if (points.length < 3) return;
    onConfirm({
      partId: part.id,
      viewId,
      model,
      skinTone,
      points: points.length >= 3 ? points : [],
    });
    onOpenChange(false);
  }

  const svgPath = pointsToSvgPath(points, !isDrawing);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        {/* Header */}
        <DialogHeader className="border-border border-b px-5 py-4 text-left sm:px-6">
          <DialogTitle className="font-display text-foreground text-lg font-semibold tracking-normal">
            {m['home.placement.modal_title']()}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
            {m['home.placement.modal_subtitle']()}
          </DialogDescription>
        </DialogHeader>

        {/* Controls Bar: Model + Skin Tone + Optional Sub-Views */}
        <div className="border-border flex flex-col gap-3 border-b bg-white px-5 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {/* Model selector */}
            <div className="flex items-center gap-2">
              <span className="text-foreground inline-flex items-center gap-1 text-xs font-medium">
                {m['home.placement.model_label']()}
                <span
                  title={m['home.placement.model_help']()}
                  className="text-muted-foreground"
                >
                  <HelpCircle className="size-3.5" />
                </span>
              </span>
              <div className="border-border bg-muted/60 inline-flex rounded-lg border p-0.5">
                {(
                  [
                    { id: 'man', label: m['home.placement.model_man']() },
                    { id: 'woman', label: m['home.placement.model_woman']() },
                  ] as const
                ).map((item) => {
                  const active = model === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onModelChange(item.id)}
                      className={cn(
                        'cursor-pointer rounded-md px-3.5 py-1 text-xs font-medium transition-all',
                        active
                          ? 'text-foreground bg-white shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skin tone selector */}
            <div className="flex items-center gap-2">
              <span className="text-foreground inline-flex items-center gap-1 text-xs font-medium">
                {m['home.placement.skin_tone_label']()}
                <span
                  title={m['home.placement.skin_tone_help']()}
                  className="text-muted-foreground"
                >
                  <HelpCircle className="size-3.5" />
                </span>
              </span>
              <div className="flex items-center gap-2">
                {SKIN_TONES.map((tone) => {
                  const active = skinTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      aria-label={tone.name}
                      aria-pressed={active}
                      title={tone.name}
                      onClick={() => onSkinToneChange(tone.id)}
                      className={cn(
                        'size-6 cursor-pointer rounded-full border border-black/15 transition-transform',
                        active
                          ? 'ring-foreground scale-105 ring-2 ring-offset-2'
                          : 'hover:scale-105'
                      )}
                      style={{ backgroundColor: tone.color }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-center text-[10px] leading-relaxed">
            {m['home.placement.model_note']()}
          </p>

          {/* Sub-view tabs (only when body part has multiple views) */}
          {part.views.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {part.views.map((v) => {
                const active = viewId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleViewSwitch(v.id)}
                    className={cn(
                      'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground bg-white'
                    )}
                  >
                    {v.label()}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Interactive Drawing Canvas */}
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrawing}
            onPointerCancel={finishDrawing}
            className="relative aspect-[3/4] w-full max-w-[330px] cursor-crosshair touch-none overflow-hidden rounded-xl bg-[#ededed] select-none sm:max-w-[360px]"
          >
            <img
              src={imgSrc}
              alt={part.label()}
              draggable={false}
              className="pointer-events-none size-full object-contain select-none"
            />

            {/* Drawn Lasso SVG Overlay */}
            {svgPath && (
              <svg
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 size-full"
                aria-hidden="true"
              >
                <path
                  d={svgPath}
                  fill={hasCustomArea ? 'rgba(236, 72, 153, 0.24)' : 'none'}
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}

            {/* Non-blocking initial draw hint */}
            {points.length === 0 && !isDrawing && (
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-center">
                <div className="rounded-lg border border-black/10 bg-white/90 px-3 py-2 text-center shadow-xs backdrop-blur-xs">
                  <div className="text-muted-foreground text-[10px] font-medium">
                    {m['home.placement.overlay_optional']()}
                  </div>
                  <div className="text-foreground text-xs font-semibold">
                    {m['home.placement.overlay_title']()}
                  </div>
                  <div className="text-muted-foreground text-[11px]">
                    {m['home.placement.overlay_desc']()}
                  </div>
                </div>
              </div>
            )}

            {/* Floating Clear button */}
            {points.length > 0 && !isDrawing && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setPoints([]);
                }}
                className="text-foreground absolute top-3 right-3 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-black/10 bg-white/95 px-2.5 py-1.5 text-xs font-medium shadow-xs transition-colors hover:bg-white"
              >
                <Trash2 className="size-3.5" />
                <span>{m['home.placement.clear']()}</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-border flex flex-col gap-3 border-t bg-[#fafaf9] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <div className="text-foreground text-xs font-semibold sm:text-sm">
              {hasCustomArea
                ? m['home.placement.footer_drawn_title']()
                : m['home.placement.footer_default_title']()}
            </div>
            <div className="text-muted-foreground text-xs">
              {hasCustomArea
                ? m['home.placement.footer_drawn_desc']()
                : m['home.placement.footer_default_desc']()}
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!hasCustomArea}
            className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-lg px-4 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            {hasCustomArea
              ? m['home.placement.cta_use_placement']()
              : m['home.placement.cta_use_view']()}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
