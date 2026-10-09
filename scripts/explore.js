// Разведка структуры сайта: заголовки, навигация, формы, ссылки.
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage();
  await page.goto('https://3s.money/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout: 45000 });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const abs = (h) => { try { return new URL(h, location.href).href; } catch { return null; } };
    const links = [...document.querySelectorAll('a[href]')].map(a => ({
      text: (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
      href: abs(a.getAttribute('href')),
    }));
    const internal = [...new Set(links.filter(l => l.href && l.href.startsWith(location.origin)).map(l => l.href))];
    return {
      title: document.title,
      lang: document.documentElement.lang,
      metaDescription: document.querySelector('meta[name="description"]')?.content || null,
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().replace(/\s+/g, ' ')),
      h2: [...document.querySelectorAll('h2')].map(h => h.textContent.trim().replace(/\s+/g, ' ')).slice(0, 15),
      navLinks: [...document.querySelectorAll('header a, nav a')].map(a => ({
        text: (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40), href: abs(a.getAttribute('href')),
      })).slice(0, 40),
      footerLinks: [...document.querySelectorAll('footer a')].map(a => ({
        text: (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40), href: abs(a.getAttribute('href')),
      })).slice(0, 60),
      forms: [...document.querySelectorAll('form')].map(f => ({
        action: f.action, method: f.method,
        fields: [...f.querySelectorAll('input, textarea, select')].map(i => ({
          tag: i.tagName, type: i.type || null, name: i.name || null, placeholder: i.placeholder || null, required: i.required,
        })),
        buttons: [...f.querySelectorAll('button, input[type=submit]')].map(b => (b.textContent || b.value || '').trim().slice(0, 40)),
      })),
      images: [...document.querySelectorAll('img')].slice(0, 30).map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth })),
      internalPages: internal.slice(0, 60),
      buttons: [...document.querySelectorAll('button, [role=button]')].map(b => (b.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50)).filter(Boolean).slice(0, 30),
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})().catch(e => { console.error('EXPLORE_ERROR', e.message); process.exit(1); });
