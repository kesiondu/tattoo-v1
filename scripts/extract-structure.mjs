import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function extractFull() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://www.inkstudio.ai/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  const extraction = await page.evaluate(() => {
    // Collect all CSS variables from root
    const rootStyles = window.getComputedStyle(document.documentElement);
    const cssVars = {};
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        for (let r = 0; r < sheet.cssRules.length; r++) {
          const rule = sheet.cssRules[r];
          if (rule.selectorText === ':root' || rule.selectorText === '.light') {
            for (let p = 0; p < rule.style.length; p++) {
              const prop = rule.style[p];
              if (prop.startsWith('--')) {
                cssVars[prop] = rule.style.getPropertyValue(prop).trim();
              }
            }
          }
        }
      } catch (e) {}
    }

    // Inspect hero section & generator interactive elements
    const sections = Array.from(document.querySelectorAll('main > *')).map((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      const style = window.getComputedStyle(sec);
      return {
        index: idx,
        tagName: sec.tagName,
        className: sec.className,
        height: rect.height,
        background: style.backgroundColor,
        padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
        textSnippet: sec.innerText.slice(0, 300).replace(/\n+/g, ' ')
      };
    });

    // Inspect Header
    const header = document.querySelector('header');
    const headerStyle = header ? window.getComputedStyle(header) : null;
    const headerData = header ? {
      className: header.className,
      background: headerStyle.backgroundColor,
      borderBottom: headerStyle.borderBottom,
      height: header.getBoundingClientRect().height,
      html: header.outerHTML
    } : null;

    // Inspect the generator prompt box and controls
    const promptInputs = Array.from(document.querySelectorAll('textarea, input[type="text"]')).map(inp => ({
      tagName: inp.tagName,
      placeholder: inp.placeholder,
      className: inp.className,
      value: inp.value
    }));

    // Find style selector pills / tabs / options
    const pills = Array.from(document.querySelectorAll('[role="tab"], button, [data-slot]'))
      .filter(el => el.innerText && el.innerText.length < 30)
      .map(el => ({
        tag: el.tagName,
        text: el.innerText.trim(),
        role: el.getAttribute('role'),
        className: el.className
      }))
      .slice(0, 50);

    // Collect all images & SVG icons
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.width,
      height: img.height,
      className: img.className
    }));

    return {
      cssVars,
      headerData,
      sections,
      promptInputs,
      pills,
      images: images.slice(0, 50)
    };
  });

  fs.writeFileSync('docs/research/inkstudio.ai/structure.json', JSON.stringify(extraction, null, 2));

  // Let's click "Log in" and see what happens (does a modal open or redirect to /login?)
  console.log('Testing login button interaction...');
  const loginBtn = await page.$('button ::-p-text(Log in)');
  let loginModalOpened = false;
  if (loginBtn) {
    await loginBtn.click();
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'docs/design-references/inkstudio.ai/login-state.png' });
    const modal = await page.$('[role="dialog"], [data-slot="dialog-content"], .modal');
    loginModalOpened = !!modal;
    if (modal) {
      const modalHtml = await page.evaluate(m => m.outerHTML, modal);
      fs.writeFileSync('docs/research/inkstudio.ai/login-modal.html', modalHtml);
    }
  }

  console.log('Login modal opened:', loginModalOpened);
  await browser.close();
  console.log('Full extraction finished.');
}

extractFull().catch(err => {
  console.error('Extraction failed:', err);
  process.exit(1);
});
