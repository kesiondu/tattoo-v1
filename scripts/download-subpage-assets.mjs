import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = 'd:/work/tattoogenerator/tattoo/public';

const ASSETS = [
  // tattoo-font-generator placements (8)
  ...[
    'inner-wrist',
    'outer-wrist',
    'inner-forearm',
    'inner-upper-arm',
    'upper-chest',
    'upper-back',
    'front-thigh',
    'side-ankle',
  ].map((slug) => ({
    url: `https://www.inkstudio.ai/tattoo-font-generator/placements/${slug}/medium.webp`,
    dest: `tattoo-font-generator/placements/${slug}/medium.webp`,
  })),
  // tattoo-font-generator 3D poster
  {
    url: 'https://www.inkstudio.ai/tattoo-font-generator/3d-surface-preview-poster.v1.jpg',
    dest: 'tattoo-font-generator/3d-surface-preview-poster.v1.jpg',
  },
  // tattoo-font-generator 20 style guide images
  ...[
    'blackletter.webp',
    'block.webp',
    'calligraphy.webp',
    'chicano.webp',
    'classic.webp',
    'cursive.webp',
    'dark.webp',
    'gangster.webp',
    'gothic.webp',
    'minimalist.webp',
    'oldEnglish.webp',
    'roman.webp',
    'script.webp',
    'typewriter.webp',
    'handwritten.webp',
    'generic.png',
    'stencil.png',
    'traditional.png',
    'western.png',
    'graffiti.png',
  ].map((file) => ({
    url: `https://www.inkstudio.ai/tattoo-font-generator/styles/${file}`,
    dest: `tattoo-font-generator/styles/${file}`,
  })),
  // tattoo-try-on demo + poster + 14 body references
  {
    url: 'https://www.inkstudio.ai/tattoo-generator/demo/traditional-swallows-olive-branch.webp',
    dest: 'tattoo-generator/demo/traditional-swallows-olive-branch.webp',
  },
  {
    url: 'https://www.inkstudio.ai/tattoo-generator/3d-surface-tattoo-poster.v1.jpg',
    dest: 'tattoo-generator/3d-surface-tattoo-poster.v1.jpg',
  },
  ...[
    'back/back-view',
    'chest-torso/male-front-torso',
    'chest-torso/male-side-ribs',
    'arm/outer-arm',
    'arm/inner-arm',
    'leg/front-leg',
    'leg/back-leg',
    'leg/outer-leg',
    'hand/back-of-hand',
    'hand/palm',
    'foot-ankle/top-outer-foot-ankle',
    'neck-ear/front-neck-collarbone',
    'neck-ear/side-neck-behind-ear',
    'neck-ear/back-of-neck',
  ].map((area) => ({
    url: `https://www.inkstudio.ai/tattoo-generator/body-references/${area}/medium.webp`,
    dest: `tattoo-generator/body-references/${area}/medium.webp`,
  })),
  // tattoo-styles missing artworks (10 new ones from assets.inkstudio.ai)
  ...[
    'floral.webp',
    'dotwork.webp',
    'ornamental.webp',
    'anime.webp',
    'illustrative.webp',
    'tribal.webp',
    'chicano.webp',
    'mandala.webp',
    'single-needle.webp',
    'patch-sticker.webp',
    'cybersigilism.webp',
  ].map((file) => ({
    url: `https://assets.inkstudio.ai/styles/${file}`,
    dest: `assets/styles/${file}`,
  })),
];

async function downloadOne({ url, dest }) {
  const fullDest = path.join(PUBLIC, dest);
  if (fs.existsSync(fullDest) && fs.statSync(fullDest).size > 200) {
    return { dest, status: 'cached' };
  }
  fs.mkdirSync(path.dirname(fullDest), { recursive: true });
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return { dest, status: `HTTP ${res.status}`, url };
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(fullDest, buf);
    return { dest, status: 'ok', bytes: buf.length };
  } catch (err) {
    return { dest, status: `ERR ${err.message}`, url };
  }
}

async function run() {
  const results = [];
  const batchSize = 6;
  for (let i = 0; i < ASSETS.length; i += batchSize) {
    const chunk = ASSETS.slice(i, i + batchSize);
    const r = await Promise.all(chunk.map(downloadOne));
    results.push(...r);
  }
  const ok = results.filter((r) => r.status === 'ok' || r.status === 'cached');
  const failed = results.filter((r) => r.status !== 'ok' && r.status !== 'cached');
  console.log(`Downloaded/cached: ${ok.length}/${results.length}`);
  if (failed.length) {
    console.log('Failed:', JSON.stringify(failed, null, 2));
  }
}

run();
