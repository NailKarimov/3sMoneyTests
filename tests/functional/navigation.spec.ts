import { test, expect, gotoPage, KEY_PAGES, BasePage } from '../../src';

/**
 * Функциональное тестирование: обход ключевых страниц сайта.
 * Проверяем, что страницы открываются, имеют заголовок h1 и осмысленный title.
 */
test.describe('Функциональные: навигация по ключевым страницам', () => {
  for (const { path, titlePart } of KEY_PAGES) {
    test(`страница ${path} открывается и содержит контент`, async ({ page }) => {
      const current = await gotoPage(page, path);

      await expect(page).toHaveTitle(titlePart);

      // На странице должен быть видимый h1.
      await expect(current.h1).toBeVisible({ timeout: 15_000 });
      expect((await current.h1.textContent())?.trim().length).toBeGreaterThan(0);

      // Страница не должна показывать признаки ошибки.
      const bodyText = (await current.bodyText()).toLowerCase();
      expect(bodyText).not.toContain('internal server error');
      expect(bodyText).not.toContain('application error');
    });
  }

  test('переход по навигации: с главной на страницу контактов', async ({ homePage, page }) => {
    await homePage.open();
    await expect(homePage.header.contactLink).toBeAttached();
    await homePage.header.contactLink.click({ force: true });
    await page.waitForURL(/contact-us/, { timeout: 20_000 });
    await expect(homePage.h1).toBeVisible();
  });

  test('логотип в шапке ведёт на главную страницу', async ({ page }) => {
    const pricing = await new BasePage(page, '/pricing').open();
    await expect(pricing.header.logoLink).toBeAttached();
  });
});
