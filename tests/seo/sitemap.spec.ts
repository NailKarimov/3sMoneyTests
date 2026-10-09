import { test, expect, Page } from '@playwright/test';
import { gotoPage, waitForCloudflare } from '../helpers';

/**
 * robots.txt и sitemap: наличие, валидность, выборочная проверка URL.
 * ВАЖНО: Cloudflare блокирует запросы к XML через request-контекст (403),
 * поэтому сами sitemap-файлы читаем через настоящую навигацию браузера.
 * Актуальный sitemap сайта — /sitemap-index.xml (указан в robots.txt).
 */

/** Открывает XML в браузере (обходя CF) и возвращает список <loc>. */
async function fetchSitemapLocs(page: Page, url: string): Promise<string[]> {
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
  await waitForCloudflare(page).catch(() => {});
  if (!resp || resp.status() >= 400) return [];
  const xml = await page.content();
  return [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)].map((m) => m[1]);
}

test.describe('robots.txt и sitemap', () => {
  test('robots.txt существует, не закрывает сайт и указывает sitemap', async ({ page }) => {
    await gotoPage(page, '/'); // cf-куки
    const resp = await page.request.get('https://3s.money/robots.txt');
    expect(resp.status(), 'robots.txt недоступен').toBeLessThan(400);

    const body = await resp.text();
    expect(body.length).toBeGreaterThan(0);
    const fullBlock = /User-agent:\s*\*\s*[\r\n]+Disallow:\s*\/\s*$/im.test(body.trim());
    expect(fullBlock, 'robots.txt закрывает весь сайт от индексации').toBeFalsy();
    expect(/sitemap:/i.test(body), 'В robots.txt не указан Sitemap').toBeTruthy();
  });

  test('sitemap-index существует и содержит валидные URL', async ({ page }) => {
    test.setTimeout(120_000);
    await gotoPage(page, '/');

    // Берём адрес sitemap из robots.txt (сейчас это /sitemap-index.xml).
    let sitemapUrl = 'https://3s.money/sitemap-index.xml';
    const robots = await page.request.get('https://3s.money/robots.txt').catch(() => null);
    if (robots && robots.ok()) {
      const m = (await robots.text()).match(/Sitemap:\s*(\S+)/i);
      if (m) sitemapUrl = m[1];
    }

    let urls = await fetchSitemapLocs(page, sitemapUrl);
    expect(urls.length, `sitemap пуст или недоступен: ${sitemapUrl}`).toBeGreaterThan(0);

    // Если это индекс — раскрываем первый вложенный sitemap.
    if (urls[0].endsWith('.xml')) {
      urls = await fetchSitemapLocs(page, urls[0]);
    }
    expect(urls.length, 'Во вложенном sitemap подозрительно мало URL').toBeGreaterThan(10);
    test.info().annotations.push({ type: 'info', description: `URL в sitemap: ${urls.length}` });
  });

  test('выборка URL из sitemap не отдаёт 404/5xx', async ({ page }) => {
    test.setTimeout(300_000);
    await gotoPage(page, '/');

    let urls = await fetchSitemapLocs(page, 'https://3s.money/sitemap-index.xml');
    if (urls[0]?.endsWith('.xml')) urls = await fetchSitemapLocs(page, urls[0]);
    test.skip(urls.length === 0, 'sitemap недоступен — проверять нечего');

    // Равномерная выборка максимум из 15 URL — бережём Cloudflare.
    const step = Math.max(1, Math.floor(urls.length / 15));
    const sample = urls.filter((_, i) => i % step === 0).slice(0, 15);

    const broken: string[] = [];
    let blocked = 0;
    for (const url of sample) {
      // Обычные html-страницы request-контекст отдаёт нормально.
      const r = await page.request.get(url, { timeout: 20_000 }).catch(() => null);
      if (!r) broken.push(`${url} — нет ответа`);
      else if (r.status() === 403 || r.status() === 429) blocked++;
      else if (r.status() >= 400) broken.push(`${url} — HTTP ${r.status()}`);
    }

    test.info().annotations.push({
      type: 'info',
      description: `Проверено ${sample.length} из ${urls.length} URL, blocked by CF: ${blocked}`,
    });
    expect(broken, `Битые URL из sitemap:\n${broken.join('\n')}`).toEqual([]);
  });
});
