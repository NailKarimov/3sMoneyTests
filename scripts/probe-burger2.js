const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('https://3s.money/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 });
  await page.waitForTimeout(3000);
  const info = await page.evaluate(() => {
    const nav = document.querySelector('#navigationMobile');
    if (!nav) return 'no nav';
    // Все листовые элементы в правом верхнем углу экрана.
    return [...nav.querySelectorAll('*')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.left > 300 && r.top >= 0 && r.top < 70 && r.width > 5;
    }).slice(0, 8).map(el => ({
      tag: el.tagName, cls: el.className.toString().slice(0, 80),
      rect: (({ x, y, width, height }) => ({ x: Math.round(x), y: Math.round(y), w: Math.round(width), h: Math.round(height) }))(el.getBoundingClientRect()),
    }));
  });
  console.log(JSON.stringify(info, null, 2));
  // Пробуем кликнуть и посмотреть, откроется ли меню.
  await page.mouse.click(340, 33);
  await page.waitForTimeout(1500);
  const opened = await page.evaluate(() =>
    [...document.querySelectorAll('#navigationMobile a')].filter(a => {
      const r = a.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).length
  );
  console.log('links visible after click at burger:', opened);
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
