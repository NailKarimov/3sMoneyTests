const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const cf = async () => { await page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 }); };
  await page.goto('https://3s.money/', { waitUntil: 'domcontentloaded' }); await cf();
  await page.waitForTimeout(2500);
  try { await page.click('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', { timeout: 5000 }); } catch {}

  // Переключатель языка: ENG
  const lang = await page.evaluate(() => {
    const els = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && (e.textContent || '').trim() === 'ENG');
    return els.slice(0, 3).map(e => ({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 80), parentCls: (e.parentElement?.className || '').toString().slice(0, 80) }));
  });
  console.log('LANG_SWITCHER', JSON.stringify(lang, null, 2));
  // Кликаем по ENG и смотрим, что открылось
  try {
    await page.locator('text=ENG').first().click({ force: true });
    await page.waitForTimeout(1200);
    const opts = await page.evaluate(() =>
      [...document.querySelectorAll('a, li, [role=option], [role=menuitem]')]
        .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
        .map(e => (e.textContent || '').trim()).filter(t => t.length > 1 && t.length < 30)
        .filter(t => /^[A-ZА-Я]{2,3}$|Eng|Рус|Deu|Fra|Esp|中文|Рort/i.test(t)).slice(0, 12)
    );
    console.log('LANG_OPTIONS', JSON.stringify(opts));
    await page.keyboard.press('Escape');
  } catch (e) { console.log('LANG_CLICK_ERR', e.message.slice(0, 100)); }

  // Дропдауны десктоп-меню
  const nav = await page.evaluate(() => {
    const root = document.querySelector('#navigation\ \(new\), [class*="NavigationDesktop_navigation__"]');
    if (!root) return 'no desktop nav root';
    const items = [...root.querySelectorAll('[class*="dropdown" i], [aria-haspopup], [class*="menuItem" i], nav > * , [class*="mainContent"] > *')].slice(0, 12)
      .map(e => ({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 70), text: (e.textContent || '').trim().slice(0, 30), haspopup: e.getAttribute('aria-haspopup') }));
    return items;
  });
  console.log('NAV', JSON.stringify(nav, null, 2));

  // Наводим/кликаем на первый пункт меню с текстом
  const menuTexts = await page.evaluate(() => {
    const root = document.querySelector('[class*="NavigationDesktop_mainContent"]');
    if (!root) return [];
    return [...root.querySelectorAll('*')].filter(e => e.children.length === 0).map(e => (e.textContent || '').trim()).filter(t => t && t.length < 25);
  });
  console.log('MENU_TEXTS', JSON.stringify([...new Set(menuTexts)].slice(0, 15)));

  // help-centre аккордеоны
  await page.goto('https://3s.money/help-centre', { waitUntil: 'domcontentloaded' }); await cf();
  await page.waitForTimeout(2500);
  const acc = await page.evaluate(() => ({
    detailsTags: document.querySelectorAll('details').length,
    ariaExpanded: [...document.querySelectorAll('[aria-expanded]')].slice(0, 8).map(e => ({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 60), text: (e.textContent || '').trim().slice(0, 50), val: e.getAttribute('aria-expanded') })),
    accordionCls: [...document.querySelectorAll('[class*="accordion" i], [class*="Accordion"]')].slice(0, 6).map(e => ({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 70), text: (e.textContent || '').trim().slice(0, 50) })),
  }));
  console.log('HELP_ACCORDIONS', JSON.stringify(acc, null, 2));

  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
