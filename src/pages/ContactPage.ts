import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Страница контактов. Форма собрана без тега <form> (кастомная + reCAPTCHA),
 * поэтому поля ищем напрямую. Валидные данные НЕ отправляем — это боевой сайт.
 */
export class ContactPage extends BasePage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, '/contact-us');
    this.emailInput = page.locator('input[type="email"], input[name*="email" i]').first();
    this.submitButton = page
      .locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")')
      .first();
  }

  async fillEmail(value: string): Promise<void> {
    await this.emailInput.scrollIntoViewIfNeeded();
    await this.emailInput.fill(value);
  }

  /** Нажать «Отправить»; ошибки клика не роняют тест — проверяем результат отдельно. */
  async submit(): Promise<void> {
    await this.submitButton.scrollIntoViewIfNeeded().catch(() => {});
    await this.submitButton.click({ force: true }).catch(() => {});
    await this.page.waitForTimeout(2_000);
  }

  /** Показано ли сообщение об успешной отправке. */
  async isSuccessShown(): Promise<boolean> {
    const text = (await this.bodyText()).toLowerCase();
    return /thank you|thanks for|successfully sent|message sent/i.test(text);
  }
}
