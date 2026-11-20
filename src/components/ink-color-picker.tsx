import { useEffect, useRef, useState } from 'react';
import { Pipette } from 'lucide-react';

import { cn } from '@/lib/utils';

// Seven ready-made ink colours plus a "default/black" (hollow) swatch.
export const INK_PRESETS = [
  '#1F2933',
  '#4A5A6A',
  '#4A3428',
  '#D32F2F',
  '#1976D2',
  '#2E7D32',
  '#7B1FA2',
];

export const DEFAULT_INK = '#111111';

export interface InkColorPickerLabels {
  title: string;
  defaultColor: string;
  customColor: string;
  eyedropper: string;
}

interface InkColorPickerProps {
  /** null = use the default ink (black) */
  value: string | null;
  onChange: (color: string | null) => void;
  labels: InkColorPickerLabels;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

function rgbToHsv(r: number, g: number, b: number) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

export function InkColorPicker({ value, onChange, labels }: InkColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(1);
  const [val, setVal] = useState(1);
  const [format, setFormat] = useState<'rgb' | 'hex'>('rgb');
  const rootRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const current = value ?? DEFAULT_INK;
  const rgb = hexToRgb(current);
  const isCustom = value !== null && !INK_PRESETS.includes(value.toUpperCase());

  // Close the popover when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  function syncFromHex(hex: string) {
    const { r, g, b } = hexToRgb(hex);
    const hsv = rgbToHsv(r, g, b);
    setHue(hsv.h);
    setSat(hsv.s);
    setVal(hsv.v);
  }

  function applyHsv(h: number, s: number, v: number) {
    setHue(h); setSat(s); setVal(v);
    const { r, g, b } = hsvToRgb(h, s, v);
    onChange(rgbToHex(r, g, b));
  }

  function openPicker() {
    if (open) {
      setOpen(false);
      return;
    }
    // Keep an existing custom colour; otherwise seed a friendly red.
    const seed = value && isCustom ? value : '#EF4444';
    syncFromHex(seed);
    if (!(value && isCustom)) onChange(seed);
    setOpen(true);
  }

  function handleSv(e: React.PointerEvent<HTMLDivElement>) {
    const box = svRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const s = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const v = clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1);
    applyHsv(hue, s, v);
  }

  function handleHue(e: React.PointerEvent<HTMLDivElement>) {
    const box = hueRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const h = clamp((e.clientX - rect.left) / rect.width, 0, 1) * 360;
    applyHsv(h, sat, val);
  }

  function handleRgbChannel(channel: 'r' | 'g' | 'b', raw: string) {
    const n = clamp(Number(raw) || 0, 0, 255);
    const next = { ...rgb, [channel]: n };
    const hex = rgbToHex(next.r, next.g, next.b);
    onChange(hex);
    syncFromHex(hex);
  }

  async function handleEyedropper() {
    const EyeDropperCtor = (window as unknown as {
      EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
    }).EyeDropper;
    if (!EyeDropperCtor) return;
    try {
      const result = await new EyeDropperCtor().open();
      onChange(result.sRGBHex.toUpperCase());
      syncFromHex(result.sRGBHex);
    } catch {
      // user cancelled
    }
  }

  const hueColor = `hsl(${hue}, 100%, 50%)`;

  return (
    <div ref={rootRef} className="relative flex flex-col gap-2">
      <span className="text-xs font-medium text-foreground">{labels.title}</span>

      <div className="flex flex-wrap items-center gap-2">
        {INK_PRESETS.map((color) => {
          const active = value !== null && value.toUpperCase() === color.toUpperCase();
          return (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => { onChange(color); setOpen(false); }}
              className={cn(
                'size-7 rounded-lg border border-black/10 transition-all hover:scale-105',
                active && 'ring-2 ring-foreground ring-offset-2'
              )}
              style={{ backgroundColor: color }}
            />
          );
        })}

        {/* Hollow swatch = default black ink */}
        <button
          type="button"
          title={labels.defaultColor}
          onClick={() => { onChange(null); setOpen(false); }}
          className={cn(
            'size-7 rounded-lg border border-border bg-white transition-all hover:scale-105',
            value === null && 'ring-2 ring-foreground ring-offset-2'
          )}
        />

        {/* Rainbow swatch = custom colour picker */}
        <button
          type="button"
          title={labels.customColor}
          onClick={openPicker}
          className={cn(
            'size-7 rounded-lg border border-black/10 transition-all hover:scale-105',
            (open || isCustom) && 'ring-2 ring-foreground ring-offset-2'
          )}
          style={{
            background:
              'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
          }}
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 z-40 mt-2 w-64 rounded-xl border border-border bg-white p-3 shadow-lg">
          {/* Saturation / value square */}
          <div
            ref={svRef}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              handleSv(e);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) handleSv(e);
            }}
            className="relative h-36 w-full cursor-crosshair rounded-md"
            style={{
              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
            }}
          >
            <span
              className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
              style={{ left: `${sat * 100}%`, top: `${(1 - val) * 100}%` }}
            />
          </div>

          {/* Hue bar + eyedropper + current colour */}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              title={labels.eyedropper}
              onClick={() => void handleEyedropper()}
              className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted"
            >
              <Pipette className="size-3.5" />
            </button>
            <span
              className="size-6 shrink-0 rounded-full border border-black/10"
              style={{ backgroundColor: current }}
            />
            <div
              ref={hueRef}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                handleHue(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) handleHue(e);
              }}
              className="relative h-3 flex-1 cursor-pointer rounded-full"
              style={{
                background:
                  'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
              }}
            >
              <span
                className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                style={{ left: `${(hue / 360) * 100}%` }}
              />
            </div>
          </div>

          {/* RGB / HEX inputs */}
          <div className="mt-3 flex items-end gap-2">
            {format === 'rgb' ? (
              (['r', 'g', 'b'] as const).map((ch) => (
                <label key={ch} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[ch]}
                    onChange={(e) => handleRgbChannel(ch, e.target.value)}
                    className="h-8 w-full rounded-md border border-border bg-white text-center text-xs text-foreground outline-none focus:border-foreground"
                  />
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">
                    {ch}
                  </span>
                </label>
              ))
            ) : (
              <label className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <input
                  type="text"
                  value={current}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
                      const hex = (v.startsWith('#') ? v : `#${v}`).toUpperCase();
                      onChange(hex);
                      syncFromHex(hex);
                    }
                  }}
                  className="h-8 w-full rounded-md border border-border bg-white text-center text-xs text-foreground outline-none focus:border-foreground"
                />
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  hex
                </span>
              </label>
            )}
            <button
              type="button"
              onClick={() => setFormat((f) => (f === 'rgb' ? 'hex' : 'rgb'))}
              className="mb-4 flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
              aria-label="Toggle colour format"
            >
              ⇅
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
