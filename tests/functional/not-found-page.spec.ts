import { test, expect } from '../../src';

/**
 * Негативные сценарии: поведение сайта на несуществующих URL.
 */
test.describe('Негативные: обработка несуществующих страниц', () => {
  test('несуществующий URL возвращает HTTP 404', async ({ notFoundPage }) => {
    const resp = await notFoundPage.openAndGetResponse();
    expect(resp?.status(), 'Ожидался статус 404').toBe(404);
  });

  test('страница 404 сообщает пользователю, что страница не найдена', async ({ notFoundPage, page }) => {
    await notFoundPage.openAndGetResponse();
    expect(
      await notFoundPage.mentionsNotFound(),
      `Пользователь не видит сообщения об ошибке. title="${await page.title()}"`
    ).toBeTruthy();
  });

  test('страница 404 даёт ссылку для возврата на сайт', async ({ notFoundPage }) => {
    await notFoundPage.openAndGetResponse();
    expect(await notFoundPage.homeLinks.count(), 'Нет ссылки на главную со страницы 404').toBeGreaterThan(0);
  });
});
