// Верификация: 1) мобильное меню на 375px; 2) самые тяжёлые ресурсы главной.
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });

  // --- Мобильное меню ---
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('https://3s.money/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 });
  await page.waitForTimeout(3000);
  const mobile = await page.evaluate(() => {
    const vis = (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    };
    const headerButtons = [...document.querySelectorAll('header button, [class*="Navigation"] button, [class*="nav"] button')]
      .map(b => ({ cls: b.className.toString().slice(0, 60), aria: b.getAttribute('aria-label'), visible: vis(b), text: (b.textContent || '').trim().slice(0, 30) }));
    const navMobile = [...document.querySelectorAll('[class*="NavigationMobile"], [class*="mobile" i]')].slice(0, 10)
      .map(e => ({ tag: e.tagName, cls: e.className.toString().slice(0, 70), visible: vis(e) }));
    return { headerButtons: headerButtons.slice(0, 15), navMobile };
  });
  console.log('MOBILE', JSON.stringify(mobile, null, 2));
  await page.close();

  // --- Тяжёлые ресурсы ---
  const page2 = await browser.newPage();
  const sizes = new Map();
  page2.on('response', (resp) => {
    const len = parseInt(resp.headers()['content-length'] || '0', 10);
    if (len > 0) sizes.set(resp.url(), (sizes.get(resp.url()) || 0) + len);
  });
  await page2.goto('https://3s.money/', { waitUntil: 'domcontentloaded' });
  await page2.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 });
  await page2.waitForTimeout(8000);
  const top = [...sizes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)
    .map(([u, s]) => `${(s / 1024 / 1024).toFixed(1)} MB  ${u.slice(0, 110)}`);
  const total = [...sizes.values()].reduce((a, b) => a + b, 0);
  console.log('TOTAL_MB', (total / 1024 / 1024).toFixed(1));
  console.log(top.join('\n'));

  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
