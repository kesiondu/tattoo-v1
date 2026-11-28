const task = await taskSpace('Trigger PVUV production visit');
const page = task.page('p1');

await page.goto('https://tattoogenerator.online/');
await page.waitForSelector('script#pvuv-loader', { state: 'attached' });
await page.waitForFunction(
  () =>
    performance
      .getEntriesByType('resource')
      .some((entry) => entry.name.startsWith('https://www.pvuv.ai/f.js')),
  undefined,
  { timeout: 15_000 }
);

console.log(
  await page.evaluate(() => {
    const script = document.querySelector('#pvuv-loader');
    return {
      url: window.location.href,
      title: document.title,
      script: script
        ? {
            src: script.getAttribute('src'),
            defer: script.hasAttribute('defer'),
            site: script.getAttribute('data-site'),
            api: script.getAttribute('data-api'),
          }
        : null,
      loadedResource: performance
        .getEntriesByType('resource')
        .some((entry) => entry.name.startsWith('https://www.pvuv.ai/f.js')),
    };
  })
);
console.log({ taskSpaceId: task.spaceId, page: page.label });
