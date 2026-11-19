import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = 'd:/work/tattoogenerator/tattoo/public';

const ASSETS = [
  // Gallery 1..9 (assets.inkstudio.ai/gallery/)
  ...[
    'rib-calligraphy-tattoo',
    'cybersigilism-tattoo-36',
    'ornamental-flower-tattoo',
    'japanese-fox-and-kitsune-mask-tattoo',
    'minimalist-cat-tattoo',
    'cherry-blossom-tattoo',
    'mandala-tattoo-112',
    'fine-line-decorative-star-tattoo',
    'hand-calligraphy-tattoo',
  ].flatMap((slug) => [
    {
      url: `https://assets.inkstudio.ai/gallery/${slug}-artwork.webp`,
      dest: `gallery/${slug}-artwork.webp`,
    },
    {
      url: `https://assets.inkstudio.ai/gallery/${slug}-body.webp`,
      dest: `gallery/${slug}-body.webp`,
    },
  ]),
  // Cards 10..24 additional assets
  {
    url: 'https://assets.inkstudio.ai/styles/geometric/geometric-07-artwork.webp',
    dest: 'gallery/geometric-07-artwork.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/geometric/geometric-07.webp',
    dest: 'gallery/geometric-07-body.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/single-needle/single-needle-artwork.webp',
    dest: 'gallery/single-needle-artwork.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/single-needle/single-needle-04.webp',
    dest: 'gallery/single-needle-body.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/fine-line/fine-line-clean-artwork.webp',
    dest: 'gallery/fine-line-ribbon-artwork.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/fine-line/fine-line-try-on.webp',
    dest: 'gallery/fine-line-ribbon-body.webp',
  },
  {
    url: 'https://www.inkstudio.ai/tattoo-how-it-works/body-preview.webp',
    dest: 'tattoo-how-it-works/body-preview.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/dotwork/dotwork-artwork.webp',
    dest: 'gallery/dotwork-eye-artwork.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/dotwork/dotwork-03.webp',
    dest: 'gallery/dotwork-eye-body.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/minimalist/minimalist-08-artwork.webp',
    dest: 'gallery/minimalist-butterfly-artwork.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/minimalist/minimalist-08.webp',
    dest: 'gallery/minimalist-butterfly-body.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/blackwork/blackwork-clean-artwork.webp',
    dest: 'gallery/blackwork-leaf-artwork.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/blackwork/blackwork-10.webp',
    dest: 'gallery/blackwork-leaf-body.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/cybersigilism-tattoo/cybersigilism-tattoo-artwork.webp',
    dest: 'gallery/cybersigilism-back-artwork.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/cybersigilism-tattoo/cybersigilism-tattoo-try-on.webp',
    dest: 'gallery/cybersigilism-back-body.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/american-traditional/american-traditional-clean-artwork.webp',
    dest: 'gallery/american-traditional-dagger-artwork.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/american-traditional/american-traditional-try-on.webp',
    dest: 'gallery/american-traditional-dagger-body.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/chicano/chicano-artwork.webp',
    dest: 'gallery/chicano-portrait-artwork.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/chicano/chicano-08.webp',
    dest: 'gallery/chicano-portrait-body.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/watercolor/watercolor-01-artwork.webp',
    dest: 'gallery/watercolor-hummingbird-artwork.webp',
  },
  {
    url: 'https://assets.inkstudio.ai/styles/watercolor/watercolor-01.webp',
    dest: 'gallery/watercolor-hummingbird-body.webp',
  },
];

async function downloadOne({ url, dest }) {
  const fullDest = path.join(PUBLIC, dest);
  if (fs.existsSync(fullDest) && fs.statSync(fullDest).size > 200) {
    return { dest, status: 'cached' };
  }
  fs.mkdirSync(path.dirname(fullDest), { recursive: true });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) return { dest, status: `HTTP ${res.status}`, url };
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(fullDest, buf);
      return { dest, status: 'ok', bytes: buf.length };
    } catch (err) {
      if (attempt === 1) return { dest, status: `ERR ${err.message}`, url };
    }
  }
}

async function run() {
  const results = [];
  for (let i = 0; i < ASSETS.length; i += 6) {
    const r = await Promise.all(ASSETS.slice(i, i + 6).map(downloadOne));
    results.push(...r);
  }
  const ok = results.filter((r) => r.status === 'ok' || r.status === 'cached');
  const failed = results.filter((r) => r.status !== 'ok' && r.status !== 'cached');
  console.log(`Batch 2 downloaded/cached: ${ok.length}/${results.length}`);
  if (failed.length) console.log('Failed:', JSON.stringify(failed, null, 2));
}

run();
