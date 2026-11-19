import fs from 'fs';

const html = fs.readFileSync('docs/research/inkstudio.ai/homepage.html', 'utf8');
const assets = new Set();
const re = /https?:\/\/[^"'<>\s]+?\.(?:png|jpg|jpeg|webp|svg|ico)/gi;
let m;
while ((m = re.exec(html)) !== null) {
  assets.add(m[0]);
}

const localRe = /(?:href|src|srcset)=["']([^"' ]+\.(?:png|jpg|jpeg|webp|svg|ico))["']/gi;
while ((m = localRe.exec(html)) !== null) {
  let u = m[1];
  if (u.startsWith('/')) {
    u = 'https://www.inkstudio.ai' + u;
  }
  assets.add(u);
}

// Check next/image url parameters
const nextImgRe = /_next\/image\?url=([^&"']+)/gi;
while ((m = nextImgRe.exec(html)) !== null) {
  const decoded = decodeURIComponent(m[1]);
  if (decoded.startsWith('/')) {
    assets.add('https://www.inkstudio.ai' + decoded);
  } else if (decoded.startsWith('http')) {
    assets.add(decoded);
  }
}

console.log('Total unique image assets found:', assets.size);
fs.writeFileSync('docs/research/inkstudio.ai/image-urls.json', JSON.stringify(Array.from(assets), null, 2));
