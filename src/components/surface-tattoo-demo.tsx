import { useEffect, useState } from 'react';
import { MousePointer2 } from 'lucide-react';

const transparentCache = new Map<string, string>();

/**
 * Strips white / warm-cream paper background from a tattoo design image into
 * true alpha transparency (cached by src URL) so it never shows a rectangular
 * background patch on skin, even under 3D perspective transforms or masks.
 */
export function useTransparentTattooSrc(src: string | null): string | null {
  const [processed, setProcessed] = useState<string | null>(() =>
    src ? (transparentCache.get(src) ?? src) : null
  );

  useEffect(() => {
    if (!src) {
      setProcessed(null);
      return;
    }
    const cached = transparentCache.get(src);
    if (cached) {
      setProcessed(cached);
      return;
    }
    setProcessed(src);

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const maxDim = 720;
        const scale = Math.min(
          1,
          maxDim / Math.max(img.naturalWidth || 1, img.naturalHeight || 1)
        );
        const w = Math.max(1, Math.round((img.naturalWidth || 400) * scale));
        const h = Math.max(1, Math.round((img.naturalHeight || 400) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const a = d[i + 3];
          if (a === 0) continue;

          const minCh = Math.min(r, g, b);
          const maxCh = Math.max(r, g, b);
          const spread = maxCh - minCh;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          // Pure or warm-paper white background -> transparent with smooth feathering
          if (lum > 236 && spread < 26) {
            d[i + 3] = 0;
          } else if (lum > 205 && spread < 32) {
            const factor = (236 - lum) / 31;
            d[i + 3] = Math.round(a * Math.max(0, Math.min(1, factor)));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const outUrl = canvas.toDataURL('image/png');
        transparentCache.set(src, outUrl);
        if (!cancelled) setProcessed(outUrl);
      } catch {
        // Fallback to original src if canvas is tainted
      }
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return processed;
}

interface Waypoint {
  x: number; // % of container width
  y: number; // % of container height
  rotateY: number; // deg — 3D horizontal body curvature wrap
  rotateX: number; // deg — 3D vertical torso tilt
  rotateZ: number; // deg — natural in-plane alignment
  scale: number; // relative scale
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function useLoopingPath(waypoints: Waypoint[], segmentDurationMs: number) {
  const [pose, setPose] = useState<Waypoint>(waypoints[0]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced || waypoints.length < 2) {
      setPose(waypoints[0]);
      return;
    }

    let rafId = 0;
    const totalDuration = waypoints.length * segmentDurationMs;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTime) % totalDuration;
      const segFloat = elapsed / segmentDurationMs;
      const idx = Math.floor(segFloat) % waypoints.length;
      const nextIdx = (idx + 1) % waypoints.length;
      const localT = easeInOutCubic(segFloat - Math.floor(segFloat));

      const a = waypoints[idx];
      const b = waypoints[nextIdx];

      setPose({
        x: lerp(a.x, b.x, localT),
        y: lerp(a.y, b.y, localT),
        rotateY: lerp(a.rotateY, b.rotateY, localT),
        rotateX: lerp(a.rotateX, b.rotateX, localT),
        rotateZ: lerp(a.rotateZ, b.rotateZ, localT),
        scale: lerp(a.scale, b.scale, localT),
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [waypoints, segmentDurationMs]);

  return pose;
}

// Gliding 3D body-surface path across male side-ribs / shoulder / chest
const TRYON_WAYPOINTS: Waypoint[] = [
  // Side ribs
  { x: 52, y: 66, rotateY: 22, rotateX: 4, rotateZ: -4, scale: 0.96 },
  // Upper rib / under pec
  { x: 56, y: 50, rotateY: 16, rotateX: 2, rotateZ: -2, scale: 1.0 },
  // Upper chest / collarbone
  { x: 54, y: 31, rotateY: 10, rotateX: -8, rotateZ: 3, scale: 0.94 },
  // Outer shoulder curve
  { x: 40, y: 38, rotateY: -24, rotateX: -4, rotateZ: -8, scale: 0.88 },
  // Back down to side ribs
  { x: 50, y: 62, rotateY: 20, rotateX: 4, rotateZ: -5, scale: 0.98 },
];

export function TryOnSurfaceDemo({ onClick }: { onClick?: () => void }) {
  const pose = useLoopingPath(TRYON_WAYPOINTS, 2200);
  const swallowSrc = useTransparentTattooSrc(
    '/tattoo-generator/demo/traditional-swallows-olive-branch.webp'
  );

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
      className="relative min-h-[420px] flex-1 cursor-pointer overflow-hidden rounded-xl border border-border/80 bg-[#efefef] shadow-xs select-none"
    >
      <img
        src="/tattoo-generator/body-references/chest-torso/male-side-ribs/medium.webp"
        alt="3D live adjustment example"
        draggable={false}
        className="pointer-events-none size-full object-cover object-top"
      />

      {/* Alpha-masked 3D surface-warped tattoo layer with true transparent background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            'url(/tattoo-generator/body-references/chest-torso/male-side-ribs/medium.webp)',
          WebkitMaskImage:
            'url(/tattoo-generator/body-references/chest-torso/male-side-ribs/medium.webp)',
          maskSize: 'cover',
          WebkitMaskSize: 'cover',
          maskPosition: 'top',
          WebkitMaskPosition: 'top',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        <div
          className="absolute w-[32%] will-change-transform"
          style={{
            left: `${pose.x}%`,
            top: `${pose.y}%`,
            opacity: 0.88,
            transform: `translate(-50%, -50%) perspective(460px) rotateY(${pose.rotateY.toFixed(1)}deg) rotateX(${pose.rotateX.toFixed(1)}deg) rotateZ(${pose.rotateZ.toFixed(1)}deg) scale(${pose.scale.toFixed(3)})`,
          }}
        >
          {swallowSrc && (
            <img
              src={swallowSrc}
              alt=""
              draggable={false}
              className="block h-auto w-full"
            />
          )}
        </div>
      </div>

      {/* Subtle animated drag cursor indicator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 will-change-transform"
        style={{
          left: `${pose.x + 2}%`,
          top: `${pose.y + 3}%`,
          transform: 'translate(-20%, -20%)',
        }}
      >
        <MousePointer2 className="size-4 fill-white text-neutral-900 drop-shadow-sm" />
      </div>
    </div>
  );
}

// Gliding 3D surface path across upper chest for font generator preview
const FONT_WAYPOINTS: Waypoint[] = [
  // Left chest
  { x: 34, y: 40, rotateY: -18, rotateX: 5, rotateZ: -3, scale: 0.94 },
  // Center upper chest
  { x: 50, y: 36, rotateY: 0, rotateX: 4, rotateZ: 0, scale: 1.0 },
  // Right chest
  { x: 66, y: 40, rotateY: 18, rotateX: 5, rotateZ: 3, scale: 0.94 },
  // Lower sternum / rib line
  { x: 50, y: 54, rotateY: 2, rotateX: -5, rotateZ: -1, scale: 0.96 },
];

export function FontSurfaceDemo({
  text,
  label,
}: {
  text?: string;
  label: string;
}) {
  const pose = useLoopingPath(FONT_WAYPOINTS, 2100);
  const displayText = text?.trim() || 'InkStudio';

  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#e5e5e5] select-none">
      <img
        src="/tattoo-font-generator/placements/upper-chest/medium.webp"
        alt={label}
        draggable={false}
        className="pointer-events-none size-full object-cover"
      />

      {/* Alpha-masked 3D surface-warped lettering layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            'url(/tattoo-font-generator/placements/upper-chest/medium.webp)',
          WebkitMaskImage:
            'url(/tattoo-font-generator/placements/upper-chest/medium.webp)',
          maskSize: 'cover',
          WebkitMaskSize: 'cover',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        <div
          className="absolute will-change-transform"
          style={{
            left: `${pose.x}%`,
            top: `${pose.y}%`,
            opacity: 0.86,
            transform: `translate(-50%, -50%) perspective(460px) rotateY(${pose.rotateY.toFixed(1)}deg) rotateX(${pose.rotateX.toFixed(1)}deg) rotateZ(${pose.rotateZ.toFixed(1)}deg) scale(${pose.scale.toFixed(3)})`,
          }}
        >
          <span
            className="block text-center text-2xl whitespace-nowrap text-[#1c1917] sm:text-[26px]"
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {displayText}
          </span>
        </div>
      </div>

      {/* Subtle animated drag cursor indicator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 will-change-transform"
        style={{
          left: `${pose.x + 4}%`,
          top: `${pose.y + 4}%`,
          transform: 'translate(-20%, -20%)',
        }}
      >
        <MousePointer2 className="size-4 fill-white text-neutral-900 drop-shadow-sm" />
      </div>

      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-xs backdrop-blur-xs">
        {label}
      </span>
    </div>
  );
}
