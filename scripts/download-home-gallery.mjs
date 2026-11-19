import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_GALLERY = path.resolve('public/gallery');

const FILES = [
  // Row 1 (12)
  'archangel-warrior-back-tattoo-04.webp',
  'cherry-blossom-hand-wrist-tattoo-02.webp',
  'fine-line-ornamental-rib-tattoo-24.webp',
  'japanese-koi-sleeve-tattoo-11.webp',
  'celestial-moon-neck-tattoo-03.webp',
  'traditional-black-cat-thigh-tattoo-21.webp',
  'polynesian-tribal-shoulder-chest-tattoo-28.webp',
  'lotus-jewelry-thigh-tattoo-12.webp',
  'gothic-blackwork-hand-tattoo-01.webp',
  'ornamental-floral-dagger-back-tattoo-22.webp',
  'butterfly-lotus-neck-back-tattoo-13.webp',
  'biomechanical-gear-arm-tattoo-20.webp',
  // Row 2 (12)
  'fine-line-botanical-collarbone-tattoo-36.webp',
  'cyber-sigilism-hand-wrist-tattoo-30.webp',
  'neo-traditional-cat-heart-thigh-tattoo-35.webp',
  'tarot-eye-celestial-forearm-tattoo-38.webp',
  'fine-line-floral-hip-tattoo-39.webp',
  'black-gray-angel-warrior-forearm-tattoo-40.webp',
  'loyalty-script-hand-tattoo-31.webp',
  'anime-manga-portrait-calf-tattoo-37.webp',
  'minimal-black-cat-shoulder-tattoo-42.webp',
  'blackletter-number-hand-finger-tattoo-32.webp',
  'cartoon-character-quote-forearm-tattoo-41.webp',
  'blackwork-scorpion-hand-tattoo-45.webp',
];

async function downloadOne(file) {
  const fullDest = path.join(PUBLIC_GALLERY, file);
  if (fs.existsSync(fullDest) && fs.statSync(fullDest).size > 200) {
    return { file, status: 'cached' };
  }
  fs.mkdirSync(PUBLIC_GALLERY, { recursive: true });
  const url = `https://assets.inkstudio.ai/gallery/${file}`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (!res.ok) return { file, status: `HTTP ${res.status}`, url };
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(fullDest, buf);
      return { file, status: 'ok', bytes: buf.length };
    } catch (err) {
      if (attempt === 1) return { file, status: `ERR ${err.message}`, url };
    }
  }
}

async function run() {
  const results = [];
  for (let i = 0; i < FILES.length; i += 6) {
    const r = await Promise.all(FILES.slice(i, i + 6).map(downloadOne));
    results.push(...r);
  }
  const ok = results.filter((r) => r.status === 'ok' || r.status === 'cached');
  const failed = results.filter(
    (r) => r.status !== 'ok' && r.status !== 'cached'
  );
  console.log(`Home gallery downloaded/cached: ${ok.length}/${results.length}`);
  if (failed.length) console.log('Failed:', JSON.stringify(failed, null, 2));
}

run();
