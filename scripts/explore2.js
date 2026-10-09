// Разведка №2: страница contact-us (форма) и поведение 404.
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage();

  // --- contact-us ---
  await page.goto('https://3s.money/contact-us', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 });
  await page.waitForTimeout(4000);

  const contact = await page.evaluate(() => ({
    title: document.title,
    h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().replace(/\s+/g, ' ')),
    forms: [...document.querySelectorAll('form')].map(f => ({
      id: f.id, action: f.action, method: f.method, cls: f.className.slice(0, 80),
      fields: [...f.querySelectorAll('input, textarea, select')].map(i => ({
        tag: i.tagName, type: i.type || null, name: i.name || null,
        placeholder: i.placeholder || null, required: i.required,
        label: i.labels && i.labels[0] ? i.labels[0].textContent.trim().slice(0, 40) : null,
      })),
      buttons: [...f.querySelectorAll('button, input[type=submit]')].map(b => (b.textContent || b.value || '').trim().slice(0, 40)),
    })),
    iframes: [...document.querySelectorAll('iframe')].map(i => (i.src || '').slice(0, 100)),
    cookieBanner: !!document.querySelector('#CybotCookiebotDialog'),
  }));
  console.log('CONTACT', JSON.stringify(contact, null, 2));

  // --- 404 ---
  const resp = await page.goto('https://3s.money/definitely-not-a-page-xyz-123', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2000);
  console.log('NOT_FOUND', JSON.stringify({
    status: resp && resp.status(),
    title: await page.title(),
    bodySnippet: (await page.evaluate(() => document.body.innerText.slice(0, 300))),
  }, null, 2));

  await browser.close();
})().catch(e => { console.error('EXPLORE_ERROR', e.message); process.exit(1); });
