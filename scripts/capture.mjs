import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to https://www.inkstudio.ai/...');
  await page.goto('https://www.inkstudio.ai/', { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait a few seconds for hydration/animations
  await new Promise(r => setTimeout(r, 4000));

  console.log('Taking desktop screenshot...');
  await page.screenshot({ path: 'docs/design-references/inkstudio.ai/desktop.png', fullPage: true });

  console.log('Extracting page styles, fonts and structure...');
  const pageDetails = await page.evaluate(() => {
    // Collect fonts
    const fonts = Array.from(document.fonts).map(f => ({ family: f.family, weight: f.weight, style: f.style }));
    
    // Collect color palette / root styles
    const computedRoot = window.getComputedStyle(document.documentElement);
    const bodyStyles = window.getComputedStyle(document.body);

    // Collect all links & nav items
    const navLinks = Array.from(document.querySelectorAll('nav a, header a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
      className: a.className
    }));

    // Collect buttons
    const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim(),
      className: b.className
    }));

    return {
      title: document.title,
      fonts,
      body: {
        background: bodyStyles.backgroundColor,
        color: bodyStyles.color,
        fontFamily: bodyStyles.fontFamily,
      },
      navLinks,
      buttons: buttons.slice(0, 30)
    };
  });

  fs.writeFileSync('docs/research/inkstudio.ai/page-details.json', JSON.stringify(pageDetails, null, 2));

  // Mobile screenshot
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await new Promise(r => setTimeout(r, 2000));
  console.log('Taking mobile screenshot...');
  await page.screenshot({ path: 'docs/design-references/inkstudio.ai/mobile.png', fullPage: true });

  await browser.close();
  console.log('Capture finished successfully!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
