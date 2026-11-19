import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function extractAll() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://www.inkstudio.ai/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  const allData = await page.evaluate(() => {
    function getCssProperties(el) {
      if (!el) return {};
      const cs = window.getComputedStyle(el);
      return {
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        border: cs.border,
        boxShadow: cs.boxShadow,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        margin: `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`,
        display: cs.display,
        gap: cs.gap
      };
    }

    // 1. Header
    const header = document.querySelector('header');
    
    // 2. Hero Section
    const heroH1 = document.querySelector('h1');
    const heroSection = heroH1 ? heroH1.closest('section') || heroH1.parentElement : null;

    // 3. Generator Box
    const generatorContainer = document.querySelector('textarea')?.closest('[class*="rounded"]');

    // 4. Style Selector Grid
    const styleImages = Array.from(document.querySelectorAll('img[src*="styles/"]')).map(img => {
      const card = img.closest('button, [role="button"], div');
      return {
        name: card ? card.innerText.trim() : '',
        src: img.src,
        className: card?.className
      };
    });

    // 5. All sections on the page
    const sections = Array.from(document.querySelectorAll('main section, main > div')).map(sec => {
      const h2 = sec.querySelector('h2');
      const h3 = sec.querySelector('h3');
      const p = sec.querySelector('p');
      const imgs = Array.from(sec.querySelectorAll('img')).map(i => ({ src: i.src, alt: i.alt }));
      return {
        title: h2 ? h2.innerText.trim() : (h3 ? h3.innerText.trim() : ''),
        text: p ? p.innerText.trim() : '',
        rawText: sec.innerText.slice(0, 500).replace(/\s+/g, ' '),
        className: sec.className,
        style: getCssProperties(sec),
        images: imgs
      };
    });

    // 6. Footer
    const footer = document.querySelector('footer');

    // 7. Extract all buttons text & styles
    const buttons = Array.from(document.querySelectorAll('button')).map(btn => ({
      text: btn.innerText.trim(),
      className: btn.className,
      style: getCssProperties(btn)
    }));

    return {
      header: {
        className: header?.className,
        style: getCssProperties(header),
        html: header?.innerHTML
      },
      hero: {
        className: heroSection?.className,
        style: getCssProperties(heroSection),
        h1: heroH1?.innerText.trim(),
        h1Style: getCssProperties(heroH1),
        h1Class: heroH1?.className
      },
      generator: {
        className: generatorContainer?.className,
        style: getCssProperties(generatorContainer),
        html: generatorContainer?.outerHTML
      },
      styles: styleImages,
      sections,
      footer: {
        className: footer?.className,
        style: getCssProperties(footer),
        html: footer?.innerHTML
      },
      buttons: buttons.filter(b => b.text)
    };
  });

  fs.writeFileSync('docs/research/inkstudio.ai/detailed-specs.json', JSON.stringify(allData, null, 2));

  // Now test logged-in mockup state or what pages look like
  // Let's also check /pricing, /tattoo-try-on, /tattoo-ideas
  const routes = ['pricing', 'tattoo-try-on', 'tattoo-ideas', 'tattoo-font-generator'];
  for (const r of routes) {
    console.log(`Checking route /${r}...`);
    try {
      await page.goto(`https://www.inkstudio.ai/${r}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(res => setTimeout(res, 2000));
      await page.screenshot({ path: `docs/design-references/inkstudio.ai/${r}.png`, fullPage: false });
    } catch (e) {
      console.log(`Route /${r} failed:`, e.message);
    }
  }

  await browser.close();
  console.log('Detailed specs and subpages captured!');
}

extractAll().catch(e => {
  console.error(e);
  process.exit(1);
});
