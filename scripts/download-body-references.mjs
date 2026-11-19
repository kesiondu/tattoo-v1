import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://www.inkstudio.ai/tattoo-generator/body-references';
const OUT = path.resolve('public/tattoo-generator/body-references');

const SKIN_TONES = [
  'natural-fair',
  'warm-ivory',
  'medium-light',
  'medium',
  'medium-dark',
  'dark',
];

const VIEWS = [
  ['back', 'back-view'],
  ['chest-torso', 'male-front-torso'],
  ['chest-torso', 'male-side-ribs'],
  ['arm', 'outer-arm'],
  ['arm', 'inner-arm'],
  ['leg', 'front-leg'],
  ['leg', 'back-leg'],
  ['leg', 'outer-leg'],
  ['hand', 'back-of-hand'],
  ['hand', 'palm'],
  ['foot-ankle', 'top-outer-foot-ankle'],
  ['neck-ear', 'front-neck-collarbone'],
  ['neck-ear', 'side-neck-behind-ear'],
  ['neck-ear', 'back-of-neck'],
];

const tasks = [];
for (const [part, view] of VIEWS) {
  for (const tone of SKIN_TONES) {
    tasks.push({
      url: `${BASE}/${part}/${view}/${tone}.webp`,
      dest: path.join(OUT, part, view, `${tone}.webp`),
    });
  }
}

let ok = 0;
let fail = 0;

async function downloadOne({ url, dest }) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    ok++;
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${res.status}: ${url}`);
    fail++;
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  ok++;
}

async function main() {
  const batchSize = 8;
  for (let i = 0; i < tasks.length; i += batchSize) {
    await Promise.all(tasks.slice(i, i + batchSize).map(downloadOne));
  }
  console.log(`Done: ${ok} ok, ${fail} failed (total ${tasks.length})`);
  if (fail > 0) process.exit(1);
}

main();
