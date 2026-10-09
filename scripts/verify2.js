const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const sizes = new Map();
  page.on('response', (r) => {
    const len = parseInt(r.headers()['content-length'] || '0', 10);
    if (len > 0) sizes.set(r.url(), len);
  });
  await page.goto('https://3s.money/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 });
  await page.waitForTimeout(3000);
  try { await page.click('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', { timeout: 5000 }); } catch {}
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-results/mobile-375.png' });
  const hdr = await page.evaluate(() => {
    const el = document.querySelector('[class*="NavigationMobile_navigationMobile"]');
    if (!el) return 'not in DOM';
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { display: s.display, visibility: s.visibility, opacity: s.opacity, rect: { w: r.width, h: r.height, top: r.top }, html: el.outerHTML.slice(0, 300) };
  });
  console.log('MOBILE_NAV', JSON.stringify(hdr, null, 2));
  await page.waitForTimeout(5000);
  const total = [...sizes.values()].reduce((a, b) => a + b, 0);
  console.log('TOTAL_MB', (total / 1024 / 1024).toFixed(1));
  console.log([...sizes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([u, s]) => `${(s / 1048576).toFixed(1)} MB  ${u.slice(0, 110)}`).join('\n'));
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
