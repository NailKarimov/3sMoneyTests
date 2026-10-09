import { test, expect } from '@playwright/test';
import { dismissCookieBanner } from '../helpers';

/**
 * Негативные сценарии: поведение сайта на несуществующих URL.
 */
test.describe('Негативные: обработка несуществующих страниц', () => {
  test('несуществующий URL возвращает HTTP 404', async ({ page }) => {
    const resp = await page.goto('/definitely-not-a-page-xyz-123', {
      waitUntil: 'domcontentloaded',
    });
    await page
      .waitForFunction(() => !document.title.includes('Just a moment'), null, {
        timeout: 45_000,
      })
      .catch(() => {});
    expect(resp?.status(), 'Ожидался статус 404').toBe(404);
  });

  test('страница 404 сообщает пользователю, что страница не найдена', async ({ page }) => {
    await page.goto('/definitely-not-a-page-xyz-123', { waitUntil: 'domcontentloaded' });
    await page
      .waitForFunction(() => !document.title.includes('Just a moment'), null, {
        timeout: 45_000,
      })
      .catch(() => {});
    await dismissCookieBanner(page);

    const title = await page.title();
    const bodyText = await page.locator('body').innerText();
    const mentionsNotFound = /not found|404|doesn'?t exist|page you.*looking for/i.test(
      title + ' ' + bodyText
    );
    expect(
      mentionsNotFound,
      `Пользователь не видит сообщения об ошибке. title="${title}"`
    ).toBeTruthy();
  });

  test('страница 404 даёт ссылку для возврата на сайт', async ({ page }) => {
    await page.goto('/definitely-not-a-page-xyz-123', { waitUntil: 'domcontentloaded' });
    await page
      .waitForFunction(() => !document.title.includes('Just a moment'), null, {
        timeout: 45_000,
      })
      .catch(() => {});
    await dismissCookieBanner(page);

    const homeLink = page.locator('a[href="/"], a[href="https://3s.money/"]');
    expect(await homeLink.count(), 'Нет ссылки на главную со страницы 404').toBeGreaterThan(0);
  });
});
