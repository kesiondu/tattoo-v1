import assert from 'node:assert/strict';
import test from 'node:test';
import { decode, encode } from 'fast-png';

import { compose, fit } from '../src/server/tattoo/composition';

test('fit and both outputs respect the silhouette, lasso and drawn strokes', () => {
  const width = 80,
    height = 80,
    data = new Uint8Array(width * height * 4).fill(200);
  for (let i = 0; i < width * height; i++)
    data[i * 4 + 3] = i % width < 30 ? 0 : 255;
  const body = { width, height, data },
    original = data.slice();
  const selection = {
    partId: 'arm',
    viewId: 'outer-arm',
    points: [
      { x: 0.1, y: 0.1 },
      { x: 0.8, y: 0.1 },
      { x: 0.8, y: 0.9 },
      { x: 0.1, y: 0.9 },
    ],
  };
  const box = fit(body, selection, 1);
  assert.ok(box.x >= 30 && box.x + box.w <= 64);
  const pixels = new Uint8Array(40 * 40 * 3).fill(255);
  for (let y = 8; y < 32; y++)
    for (let x = 17; x < 23; x++)
      pixels.fill(10, (y * 40 + x) * 3, (y * 40 + x) * 3 + 3);
  const result = compose(
    body,
    selection,
    encode({ width: 40, height: 40, channels: 3, data: pixels })
  );
  assert.equal(decode(result.artwork).data[20 * 40 + 20], 0);
  const preview = decode(result.preview);
  let changed = 0;
  for (let i = 0; i < width * height; i++)
    if (original[i * 4] !== preview.data[i * 4]) {
      changed++;
      assert.ok(
        i % width >= 30 &&
          i % width < 64 &&
          i / width >= 8 &&
          Math.floor(i / width) < 72
      );
    }
  assert.ok(changed > 0);
});
