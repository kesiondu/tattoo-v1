/**
 * Traces a raster line-art image into a true vector SVG.
 *
 * Potrace is GPL-2.0 (see COPYING and THIRD-PARTY-NOTICES.md), so a deployed
 * build must make the corresponding source available.
 */

const MAX_TRACE_EDGE = 2000;

type PotraceModule = typeof import('esm-potrace-wasm');

let potraceModule: Promise<PotraceModule> | null = null;

/**
 * The Potrace ESM build references `require`, so it must never be evaluated
 * during SSR. Load it lazily in the browser only.
 */
async function loadPotrace() {
  if (typeof window === 'undefined') {
    throw new Error('Vector tracing is only available in the browser.');
  }
  if (!potraceModule) {
    potraceModule = import('esm-potrace-wasm').then(async (mod) => {
      await mod.init();
      return mod;
    });
  }
  return potraceModule;
}

export interface TracedStencil {
  svg: string;
  width: number;
  height: number;
  pathCount: number;
}

const DEFAULT_INK_THRESHOLD = 120;

export interface TraceOptions {
  /**
   * Luminance at or below which a pixel counts as ink. Lower values keep only
   * the drawn lines and drop soft grey shading. Defaults to 120, which keeps
   * linework stencil-like instead of filling shaded areas solid black.
   */
  inkThreshold?: number;
}

/**
 * Convert a raster line-art blob into an SVG made of `<path>` outlines.
 * Throws when nothing traceable is found, so callers never fall back to
 * silently embedding the bitmap in an SVG.
 */
export async function traceStencilFromBlob(
  blob: Blob,
  options: TraceOptions = {}
): Promise<TracedStencil> {
  const { potrace } = await loadPotrace();

  const bitmap = await createImageBitmap(blob);
  try {
    const scale = Math.min(
      1,
      MAX_TRACE_EDGE / Math.max(bitmap.width, bitmap.height)
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not prepare the line art for tracing.');

    // Flatten onto white first so transparent PNG backgrounds trace correctly.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    binarize(imageData, options.inkThreshold ?? DEFAULT_INK_THRESHOLD);

    const svg = await potrace(imageData, {
      turdsize: 2,
      turnpolicy: 4,
      alphamax: 1,
      opticurve: 1,
      opttolerance: 0.2,
      extractcolors: false,
    });

    const pathCount = (svg.match(/<path\b/g) ?? []).length;
    if (pathCount === 0) {
      throw new Error(
        'No outlines were found in the generated art, so a vector export is not possible yet.'
      );
    }

    return { svg: normalizeSvg(svg, width, height), width, height, pathCount };
  } finally {
    bitmap.close?.();
  }
}

/** Thresholds to pure ink/paper and drops specks, in place. */
function binarize(imageData: ImageData, inkThreshold: number) {
  const { data, width, height } = imageData;
  const total = width * height;
  const luminance = new Uint8ClampedArray(total);

  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const alpha = data[i + 3] / 255;
    // Treat transparency as white paper.
    const lum =
      (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) * alpha +
      255 * (1 - alpha);
    luminance[p] = lum | 0;
  }

  // 1 = ink, 0 = paper
  const mask = new Uint8Array(total);
  for (let p = 0; p < total; p += 1) {
    mask[p] = luminance[p] <= inkThreshold ? 1 : 0;
  }

  despeckle(mask, width, height, Math.max(6, Math.round(total * 0.000004)));

  for (let p = 0, i = 0; p < total; p += 1, i += 4) {
    const value = mask[p] ? 0 : 255;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }
}

/** Drop isolated specks so Potrace does not turn model noise into shapes. */
function despeckle(
  mask: Uint8Array,
  width: number,
  height: number,
  minArea: number
) {
  if (minArea <= 1) return;

  const visited = new Uint8Array(mask.length);
  const stack = new Int32Array(mask.length);
  const component = new Int32Array(mask.length);

  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || visited[start]) continue;

    let size = 0;
    let top = 0;
    stack[top++] = start;
    visited[start] = 1;

    while (top > 0) {
      const index = stack[--top];
      component[size++] = index;

      const x = index % width;
      const y = (index - x) / width;

      if (x > 0 && mask[index - 1] && !visited[index - 1]) {
        visited[index - 1] = 1;
        stack[top++] = index - 1;
      }
      if (x + 1 < width && mask[index + 1] && !visited[index + 1]) {
        visited[index + 1] = 1;
        stack[top++] = index + 1;
      }
      if (y > 0 && mask[index - width] && !visited[index - width]) {
        visited[index - width] = 1;
        stack[top++] = index - width;
      }
      if (y + 1 < height && mask[index + width] && !visited[index + width]) {
        visited[index + width] = 1;
        stack[top++] = index + width;
      }
    }

    if (size < minArea) {
      for (let i = 0; i < size; i += 1) mask[component[i]] = 0;
    }
  }
}

/** Make sure the SVG carries the real pixel size, not Potrace placeholders. */
function normalizeSvg(svg: string, width: number, height: number) {
  const withoutSize = svg.replace(
    /<svg\b([^>]*)>/i,
    (_match, attrs: string) => {
      const cleaned = attrs
        .replace(/\swidth="[^"]*"/i, '')
        .replace(/\sheight="[^"]*"/i, '')
        .replace(/\sviewBox="[^"]*"/i, '');
      return `<svg${cleaned} viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;
    }
  );

  return withoutSize.includes('xmlns=')
    ? withoutSize
    : withoutSize.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
}
