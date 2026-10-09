const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const cf = async () => { await page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 }); };
  await page.goto('https://3s.money/', { waitUntil: 'domcontentloaded' }); await cf();
  await page.waitForTimeout(2500);
  try { await page.click('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', { timeout: 5000 }); } catch {}

  // Языковой дропдаун: role=button aria-haspopup=listbox
  const dd = page.locator('[role="button"][aria-haspopup="listbox"]:visible');
  console.log('LANG_DROPDOWNS_VISIBLE', await dd.count());
  if (await dd.count()) {
    await dd.first().click();
    await page.waitForTimeout(1000);
    const opts = await page.evaluate(() =>
      [...document.querySelectorAll('[role="option"], [role="listbox"] li')]
        .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0; })
        .map(e => (e.textContent || '').trim()).slice(0, 15)
    );
    console.log('LANG_OPTIONS', JSON.stringify(opts));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // Пункты десктоп-меню
  const nav = await page.evaluate(() => {
    const root = document.querySelector('[id="navigation (new)"]') || document.querySelector('[class*="NavigationDesktop_navigation__"]');
    if (!root) return 'no root';
    const leaves = [...root.querySelectorAll('*')].filter(e => e.children.length === 0);
    return [...new Set(leaves.map(e => (e.textContent || '').trim()).filter(t => t && t.length < 25))].slice(0, 20);
  });
  console.log('MENU_ITEMS', JSON.stringify(nav));

  // Наведём на «Solutions»-подобный пункт и посмотрим, появится ли подменю
  for (const label of ['Solutions', 'Products', 'Company', 'Accounts', 'Industries', 'Resources']) {
    const item = page.locator(`[id="navigation (new)"] :text-is("${label}")`).first();
    if (await item.count()) {
      const before = await page.locator('a:visible').count();
      await item.hover().catch(() => {});
      await page.waitForTimeout(800);
      const after = await page.locator('a:visible').count();
      console.log(`HOVER ${label}: links visible ${before} -> ${after}`);
    }
  }

  // help-centre аккордеоны
  await page.goto('https://3s.money/help-centre', { waitUntil: 'domcontentloaded' }); await cf();
  await page.waitForTimeout(2500);
  const acc = await page.evaluate(() => ({
    details: document.querySelectorAll('details').length,
    expanded: [...document.querySelectorAll('[aria-expanded]')].slice(0, 10).map(e => ({ tag: e.tagName, role: e.getAttribute('role'), text: (e.textContent || '').trim().slice(0, 40), val: e.getAttribute('aria-expanded') })),
    accCls: [...document.querySelectorAll('[class*="ccordion"]')].slice(0, 5).map(e => ({ tag: e.tagName, cls: e.className.toString().slice(0, 60), text: (e.textContent || '').trim().slice(0, 40) })),
    h2: [...document.querySelectorAll('h2, h3')].slice(0, 8).map(h => h.textContent.trim().slice(0, 50)),
  }));
  console.log('HELP', JSON.stringify(acc, null, 2));
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
