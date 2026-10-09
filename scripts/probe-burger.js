const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('https://3s.money/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 });
  await page.waitForTimeout(3000);
  const info = await page.evaluate(() => {
    const nav = document.querySelector('#navigationMobile');
    const cands = [...nav.querySelectorAll('div')].filter(d => {
      const r = d.getBoundingClientRect();
      return r.width > 10 && r.width < 80 && r.height > 5 && r.height < 60 && r.top < 80 && r.left > 250;
    });
    return cands.slice(0, 5).map(d => ({ cls: d.className.toString(), html: d.outerHTML.slice(0, 200) }));
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
