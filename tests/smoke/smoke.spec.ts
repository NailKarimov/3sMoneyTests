import { test, expect } from '../../src';

test.describe('3s.money — smoke-проверки', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('smoke: заголовок страницы содержит "money"', async ({ page }) => {
    await expect(page).toHaveTitle(/money/i);
  });

  test('на странице виден текст про платежи', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /payments/i }).first()).toBeVisible();
  });

  test('на странице есть хотя бы одна видимая ссылка', async ({ page }) => {
    const links = page.getByRole('link');
    await expect(links.first()).toBeVisible();
    expect(await links.count()).toBeGreaterThan(0);
  });
});
