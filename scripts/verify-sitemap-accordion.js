const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage();
  const cf = () => page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 });

  // sitemap через настоящий браузер
  const resp = await page.goto('https://3s.money/sitemap-index.xml', { waitUntil: 'domcontentloaded' });
  await cf().catch(() => {});
  const body = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log('SITEMAP_INDEX status:', resp && resp.status(), '| body:', body.replace(/\n/g, ' ').slice(0, 200));

  const resp2 = await page.goto('https://3s.money/sitemap.xml', { waitUntil: 'domcontentloaded' });
  await cf().catch(() => {});
  const body2 = await page.evaluate(() => document.body.innerText.slice(0, 200));
  console.log('SITEMAP_XML status:', resp2 && resp2.status(), '| body:', body2.replace(/\n/g, ' ').slice(0, 150));

  // аккордеон: как меняется DOM при клике
  await page.goto('https://3s.money/help-centre', { waitUntil: 'domcontentloaded' });
  await cf();
  await page.waitForTimeout(2500);
  try { await page.click('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', { timeout: 5000 }); } catch {}
  const before = await page.evaluate(() => {
    const p = document.querySelectorAll('[class*="AccordionPanel_accordionPanel"]')[1];
    const c = p.querySelector('[class*="AccordionPanel_content"]');
    return { panelCls: p.className.slice(0, 120), contentCls: c ? c.className.slice(0, 120) : null,
      contentH: c ? c.getBoundingClientRect().height : null,
      contentStyle: c ? (c.getAttribute('style') || '') : null,
      parentH: c && c.parentElement ? c.parentElement.getBoundingClientRect().height : null,
      parentCls: c && c.parentElement ? c.parentElement.className.slice(0, 100) : null };
  });
  console.log('ACC BEFORE', JSON.stringify(before, null, 2));
  await page.locator('[class*="AccordionPanel_title"]').nth(1).click();
  await page.waitForTimeout(1200);
  const after = await page.evaluate(() => {
    const p = document.querySelectorAll('[class*="AccordionPanel_accordionPanel"]')[1];
    const c = p.querySelector('[class*="AccordionPanel_content"]');
    return { panelCls: p.className.slice(0, 120),
      contentH: c ? c.getBoundingClientRect().height : null,
      parentH: c && c.parentElement ? c.parentElement.getBoundingClientRect().height : null,
      panelH: p.getBoundingClientRect().height };
  });
  console.log('ACC AFTER', JSON.stringify(after, null, 2));
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
