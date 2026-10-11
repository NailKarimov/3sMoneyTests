import { test, expect } from '../../src';

/**
 * Тестирование форм (негативные сценарии) на странице контактов.
 * ВАЖНО: валидные данные не отправляем — это боевой сайт.
 */
test.describe('Формы: страница контактов', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.open();
    await expect(contactPage.emailInput, 'Поле email не найдено').toBeAttached({ timeout: 20_000 });
  });

  test('форма обратной связи присутствует и содержит поле email и кнопку отправки', async ({ contactPage }) => {
    await expect(contactPage.submitButton, 'Кнопка отправки не найдена').toBeAttached();
  });

  test('негативный: невалидный email не приводит к успешной отправке', async ({ contactPage, page }) => {
    test.setTimeout(120_000);
    await contactPage.fillEmail('not-an-email');
    await contactPage.submit();

    // Успешной отправки быть не должно: либо показана ошибка валидации,
    // либо форма просто не ушла (страница та же, сообщения об успехе нет).
    expect(await contactPage.isSuccessShown(), 'Форма приняла невалидный email').toBeFalsy();
    expect(page.url()).toContain('contact-us');
  });

  test('обязательные поля: отправка пустой формы не проходит', async ({ contactPage }) => {
    test.setTimeout(120_000);
    await contactPage.submit();
    expect(await contactPage.isSuccessShown(), 'Пустая форма была отправлена успешно').toBeFalsy();
  });
});
