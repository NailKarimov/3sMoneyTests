import { test, expect } from '@playwright/test';
import { gotoPage, KEY_PAGES } from '../helpers';

/**
 * Функциональное тестирование: обход ключевых страниц сайта.
 * Проверяем, что страницы открываются, имеют заголовок h1 и осмысленный title.
 */
test.describe('Функциональные: навигация по ключевым страницам', () => {
  for (const { path, titlePart } of KEY_PAGES) {
    test(`страница ${path} открывается и содержит контент`, async ({ page }) => {
      await gotoPage(page, path);

      await expect(page).toHaveTitle(titlePart);

      // На странице должен быть видимый h1.
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 15_000 });
      expect((await h1.textContent())?.trim().length).toBeGreaterThan(0);

      // Страница не должна показывать признаки ошибки.
      const bodyText = (await page.locator('body').innerText()).toLowerCase();
      expect(bodyText).not.toContain('internal server error');
      expect(bodyText).not.toContain('application error');
    });
  }

  test('переход по навигации: с главной на страницу контактов', async ({ page }) => {
    await gotoPage(page, '/');
    const contactLink = page.locator('a[href*="contact-us"]').first();
    await expect(contactLink).toBeAttached();
    await contactLink.click({ force: true });
    await page.waitForURL(/contact-us/, { timeout: 20_000 });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('логотип в шапке ведёт на главную страницу', async ({ page }) => {
    await gotoPage(page, '/pricing');
    // Логотип — первая ссылка на "/" в навигации (на внутренних страницах
    // это svg без alt-текста, поэтому ищем по href, а не по alt).
    const logo = page.locator('#navigationMobile a[href="/"], [id*="navigation"] a[href="/"], header a[href="/"]').first();
    await expect(logo).toBeAttached();
  });
});
