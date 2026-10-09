import { test, expect } from '@playwright/test';
import { gotoPage } from '../helpers';

test.describe('3s.money — smoke-проверки', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, '/');
  });

  test('smoke: заголовок страницы содержит "money"', async ({ page }) => {
    await expect(page).toHaveTitle(/money/i);
  });

  test('на странице виден текст про платежи', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /payments/i }).first()
    ).toBeVisible();
  });

  test('на странице есть хотя бы одна видимая ссылка', async ({ page }) => {
    const links = page.getByRole('link');
    await expect(links.first()).toBeVisible();
    expect(await links.count()).toBeGreaterThan(0);
  });
});
