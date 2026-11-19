import fs from 'fs';
import path from 'path';

const urls = JSON.parse(fs.readFileSync('docs/research/inkstudio.ai/image-urls.json', 'utf8'));

// Also add dialog examples
urls.push(
  'https://www.inkstudio.ai/dialog-examples/watercolor-body.webp',
  'https://www.inkstudio.ai/dialog-examples/bird-body.webp',
  'https://www.inkstudio.ai/dialog-examples/fox-body.webp',
  'https://www.inkstudio.ai/dialog-examples/watercolor-paper.webp',
  'https://www.inkstudio.ai/dialog-examples/bird-paper.webp',
  'https://www.inkstudio.ai/dialog-examples/fox-paper.webp'
);

async function downloadAll() {
  for (const u of urls) {
    try {
      const urlObj = new URL(u);
      let localPath = path.join('public', urlObj.pathname);
      if (urlObj.hostname === 'assets.inkstudio.ai') {
        localPath = path.join('public', 'assets', urlObj.pathname);
      }
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      if (fs.existsSync(localPath)) {
        continue;
      }
      console.log(`Downloading ${u} -> ${localPath}`);
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(localPath, Buffer.from(buffer));
      } else {
        console.warn(`Failed ${u}: ${res.status}`);
      }
    } catch (err) {
      console.error(`Error downloading ${u}:`, err.message);
    }
  }
  console.log('Finished downloading all assets!');
}

downloadAll();
