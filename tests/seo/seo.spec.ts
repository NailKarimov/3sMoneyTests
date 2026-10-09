import { test, expect } from '@playwright/test';
import { gotoPage } from '../helpers';

/**
 * SEO-тестирование: title, meta description, canonical,
 * структура заголовков, Open Graph.
 */
const PAGES = ['/', '/accounts', '/pricing', '/contact-us'];

test.describe('SEO', () => {
  for (const path of PAGES) {
    test(`SEO-атрибуты страницы ${path}`, async ({ page }) => {
      await gotoPage(page, path);

      const title = await page.title();
      expect(title.length, `title слишком короткий: "${title}"`).toBeGreaterThan(10);
      expect(title.length, `title слишком длинный (${title.length}): "${title}"`).toBeLessThanOrEqual(75);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(description, 'meta description отсутствует').toBeTruthy();
      expect(description!.length, `description слишком короткий: "${description}"`).toBeGreaterThan(50);
      expect(description!.length, `description слишком длинный (${description!.length})`).toBeLessThanOrEqual(170);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonical, 'canonical отсутствует').toBeTruthy();

      const lang = await page.locator('html').getAttribute('lang');
      expect(lang, 'атрибут lang у <html> отсутствует').toBeTruthy();
    });

    test(`на странице ${path} ровно один <h1>`, async ({ page }) => {
      await gotoPage(page, path);
      const h1Texts = await page.$$eval('h1', (hs) =>
        hs.map((h) => (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60))
      );
      expect(
        h1Texts.length,
        `Найдено ${h1Texts.length} h1: ${JSON.stringify(h1Texts)}`
      ).toBe(1);
    });
  }

  test('главная содержит Open Graph разметку', async ({ page }) => {
    await gotoPage(page, '/');
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content').catch(() => null);
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content').catch(() => null);
    expect(ogTitle, 'og:title отсутствует').toBeTruthy();
    expect(ogDesc, 'og:description отсутствует').toBeTruthy();
  });
});
