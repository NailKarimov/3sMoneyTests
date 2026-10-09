import { test, expect } from '@playwright/test';
import { gotoPage } from '../helpers';

/**
 * Тестирование форм (негативные сценарии) на странице контактов.
 * Форма собрана без тега <form> (кастомная + reCAPTCHA), поэтому ищем поля напрямую.
 * ВАЖНО: валидные данные не отправляем — это боевой сайт.
 */
test.describe('Формы: страница контактов', () => {
  test('форма обратной связи присутствует и содержит поле email и кнопку отправки', async ({ page }) => {
    await gotoPage(page, '/contact-us');

    const emailInput = page.locator('input[type="email"], input[name*="email" i]').first();
    await expect(emailInput, 'Поле email не найдено').toBeAttached({ timeout: 20_000 });

    const submit = page
      .locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")')
      .first();
    await expect(submit, 'Кнопка отправки не найдена').toBeAttached();
  });

  test('негативный: невалидный email не приводит к успешной отправке', async ({ page }) => {
    test.setTimeout(120_000);
    await gotoPage(page, '/contact-us');

    const emailInput = page.locator('input[type="email"], input[name*="email" i]').first();
    await expect(emailInput).toBeAttached({ timeout: 20_000 });

    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill('not-an-email');

    const submit = page
      .locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")')
      .first();
    await submit.click({ force: true }).catch(() => {});
    await page.waitForTimeout(2_000);

    // Успешной отправки быть не должно: либо показана ошибка валидации,
    // либо форма просто не ушла (страница та же, сообщения об успехе нет).
    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    const successShown = /thank you|thanks for|successfully sent|message sent/i.test(bodyText);
    expect(successShown, 'Форма приняла невалидный email').toBeFalsy();
    expect(page.url()).toContain('contact-us');
  });

  test('обязательные поля: отправка пустой формы не проходит', async ({ page }) => {
    test.setTimeout(120_000);
    await gotoPage(page, '/contact-us');

    const emailInput = page.locator('input[type="email"], input[name*="email" i]').first();
    await expect(emailInput).toBeAttached({ timeout: 20_000 });

    const submit = page
      .locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")')
      .first();
    await submit.scrollIntoViewIfNeeded().catch(() => {});
    await submit.click({ force: true }).catch(() => {});
    await page.waitForTimeout(2_000);

    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    const successShown = /thank you|thanks for|successfully sent|message sent/i.test(bodyText);
    expect(successShown, 'Пустая форма была отправлена успешно').toBeFalsy();
  });
});
