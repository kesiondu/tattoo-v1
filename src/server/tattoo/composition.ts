import { decode, encode } from 'fast-png';

export type Selection = {
  partId: string;
  viewId: string;
  skinTone?: string;
  points?: { x: number; y: number }[];
};

function raster(bytes: Uint8Array) {
  const header = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (
    bytes.length < 33 ||
    header.getUint32(0) !== 0x89504e47 ||
    header.getUint32(16) * header.getUint32(20) > 2400000 ||
    bytes[24] !== 8
  )
    throw new Error('Unsupported design image. Please try a different design.');
  const { width, height, data, channels, palette } = decode(bytes);
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const p = i * channels,
      q = i * 4;
    if (palette) {
      const color = palette[data[p]];
      rgba.set([color[0], color[1], color[2], color[3] ?? 255], q);
      continue;
    }
    rgba[q] = data[p];
    rgba[q + 1] = channels >= 3 ? data[p + 1] : data[p];
    rgba[q + 2] = channels >= 3 ? data[p + 2] : data[p];
    rgba[q + 3] =
      channels === 4 || channels === 2 ? data[p + channels - 1] : 255;
  }
  return { width, height, data: rgba };
}

export async function template(selection: Selection) {
  const path =
    '/placement-v1/' +
    [selection.partId, selection.viewId, selection.skinTone || 'medium']
      .map(encodeURIComponent)
      .join('/') +
    '.png';
  const g = globalThis as any;
  const assets = (g.__CF_ENV__ ?? g.__env__)?.ASSETS;
  const url = new URL(
    path,
    process.env.VITE_APP_URL || 'http://localhost:3000'
  );
  const res = assets ? await assets.fetch(new Request(url)) : await fetch(url);
  if (!res.ok) throw new Error('Placement template unavailable.');
  return raster(new Uint8Array(await res.arrayBuffer()));
}

// Largest rectangle with the requested aspect inside BOTH the lasso and
// opaque silhouette. The histogram stack also handles concave selections.
export function fit(
  body: ReturnType<typeof raster>,
  selection: Selection,
  aspect: number
) {
  const { width: w, height: h, data } = body,
    pts = selection.points || [];
  const heights = new Int32Array(w + 1),
    stack = new Int32Array(w + 1);
  let best = { x: 0, y: 0, w: 0, h: 0 };
  for (let y = 0; y < h; y++) {
    const row = (y + 0.5) / h,
      cuts: number[] = [];
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const a = pts[i],
        b = pts[j];
      if (a.y > row !== b.y > row)
        cuts.push(w * (a.x + ((row - a.y) * (b.x - a.x)) / (b.y - a.y)));
    }
    cuts.sort((a, b) => a - b);
    let edge = 0,
      top = 0;
    for (let x = 0; x <= w; x++) {
      while (edge < cuts.length && cuts[edge] <= x + 0.5) edge++;
      heights[x] =
        x < w && edge % 2 && data[(y * w + x) * 4 + 3] >= 250
          ? heights[x] + 1
          : 0;
      while (top && heights[stack[top - 1]] > heights[x]) {
        const height = heights[stack[--top]],
          left = top ? stack[top - 1] + 1 : 0,
          span = x - left;
        const rh = Math.min(height, Math.floor(span / aspect)),
          rw = Math.floor(rh * aspect);
        if (rw * rh > best.w * best.h)
          best = {
            x: left + Math.floor((span - rw) / 2),
            y: y - height + 1 + Math.floor((height - rh) / 2),
            w: rw,
            h: rh,
          };
      }
      stack[top++] = x;
    }
  }
  if (Math.min(best.w, best.h) < 5)
    throw new Error('Circle a larger area inside the body outline.');
  return best;
}

export function compose(
  body: ReturnType<typeof raster>,
  selection: Selection,
  bytes: Uint8Array
) {
  const art = raster(bytes),
    { width: w, height: h, data } = art;
  let l = w,
    r = -1,
    t = h,
    b = -1;
  const dark = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const p = i * 4;
    for (let c = 0; c < 3; c++)
      data[p + c] = 255 - ((255 - data[p + c]) * data[p + 3]) / 255;
    if (Math.min(data[p], data[p + 1], data[p + 2]) < 225) {
      const x = i % w,
        y = Math.floor(i / w);
      l = Math.min(l, x);
      r = Math.max(r, x);
      t = Math.min(t, y);
      b = Math.max(b, y);
    }
    dark[i] = Math.max(data[p], data[p + 1], data[p + 2]) < 145 ? 1 : 0;
  }
  if (r <= l || b <= t) throw new Error('No usable ink found in the design.');
  const aw = r - l + 1,
    ah = b - t + 1;
  // Identify paired frame rails in the outer bands, requiring evidence on
  // all four sides before removing narrow neutral strokes.
  const cols = new Uint32Array(w),
    rows = new Uint32Array(h);
  for (let y = t; y <= b; y++)
    for (let x = l; x <= r; x++)
      if (dark[y * w + x]) {
        cols[x]++;
        rows[y]++;
      }
  function rails(
    counts: Uint32Array,
    start: number,
    length: number,
    threshold: number
  ) {
    const peaks: number[] = [];
    for (const high of [false, true]) {
      let peak = -1;
      for (let d = 0; d < length * 0.24; d++) {
        const n = high ? start + length - 1 - d : start + d;
        if (counts[n] > threshold && (peak < 0 || counts[n] > counts[peak]))
          peak = n;
      }
      if (peak >= 0) peaks.push(peak);
    }
    return peaks;
  }
  const vx = rails(cols, l, aw, ah * 0.24),
    hy = rails(rows, t, ah, aw * 0.24);
  if (aw > 80 && ah > 80 && vx.length === 2 && hy.length === 2) {
    const radius = Math.max(3, Math.round(Math.min(w, h) * 0.005));
    for (let y = t; y <= b; y++)
      for (let x = l; x <= r; x++) {
        if (
          vx.some((v) => Math.abs(x - v) <= radius) ||
          hy.some((v) => Math.abs(y - v) <= radius)
        ) {
          const p = (y * w + x) * 4;
          if (
            Math.max(data[p], data[p + 1], data[p + 2]) -
              Math.min(data[p], data[p + 1], data[p + 2]) <
            45
          )
            data.fill(255, p, p + 3);
        }
      }
  }
  const box = fit(body, selection, aw / ah);
  for (let y = 0; y < box.h; y++)
    for (let x = 0; x < box.w; x++) {
      const u = ((x + 0.5) / box.w) * 2 - 1;
      const px =
        l +
        Math.min(
          aw - 1,
          Math.floor((Math.asin(0.72 * u) / Math.asin(0.72) + 1) * 0.5 * aw)
        );
      const p =
        (Math.min(b, t + Math.floor(((y + 0.5) * ah) / box.h)) * w + px) * 4;
      const q = ((box.y + y) * body.width + box.x + x) * 4,
        bg = body.data;
      const light =
        (bg[q] * 0.2126 + bg[q + 1] * 0.7152 + bg[q + 2] * 0.0722) / 255;
      const mix =
        Math.min(
          1,
          ((Math.max(data[p], data[p + 1], data[p + 2]) -
            Math.min(data[p], data[p + 1], data[p + 2])) /
            245) *
            2.8
        ) *
        (0.1 + 0.38 * (1 - light));
      for (let c = 0; c < 3; c++) {
        const ink = Math.min(1, data[p + c] / 245);
        if (Math.min(data[p], data[p + 1], data[p + 2]) < 245)
          bg[q + c] = Math.round(
            bg[q + c] * (0.18 + 0.82 * ink) * (1 - mix) +
              ink * (112 + 135 * light) * mix
          );
      }
    }
  // Keep dark drawn strokes as single filled marks. In color-only regions
  // draw the darker side of coarse tonal transitions, suppress paper grain.
  const lines = new Uint8Array(w * h).fill(255);
  const lum = (i: number) =>
    data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114;
  for (let y = 2; y < h - 2; y++)
    for (let x = 2; x < w - 2; x++) {
      const i = y * w + x,
        p = i * 4,
        value = lum(i);
      const darkest = Math.min(
        lum(i - 2),
        lum(i + 2),
        lum(i - 2 * w),
        lum(i + 2 * w)
      );
      const brightest = Math.max(
        lum(i - 2),
        lum(i + 2),
        lum(i - 2 * w),
        lum(i + 2 * w)
      );
      if (
        Math.max(data[p], data[p + 1], data[p + 2]) < 90 ||
        (darkest > 85 && brightest - value > 23)
      )
        lines[i] = 0;
    }
  return {
    preview: encode({ ...body, channels: 4 }),
    artwork: encode({ width: w, height: h, channels: 1, data: lines }),
  };
}
