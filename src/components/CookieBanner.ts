import { Locator, Page } from '@playwright/test';

/**
 * Баннер согласия на cookie (Cookiebot).
 * Перекрывает контент, поэтому в обычных тестах его закрывают сразу после загрузки.
 */
export class CookieBanner {
  /** Селектор для исключения баннера из a11y-проверок (сторонний виджет). */
  static readonly SELECTOR = '#CybotCookiebotDialog';

  readonly root: Locator;
  readonly allowAllButton: Locator;
  readonly declineButton: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator(CookieBanner.SELECTOR);
    this.allowAllButton = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    this.declineButton = page.locator('#CybotCookiebotDialogBodyButtonDecline');
  }

  /** Принимает все cookie, если баннер показан; отсутствие баннера — не ошибка. */
  async acceptAllIfShown(timeout = 5_000): Promise<void> {
    try {
      await this.allowAllButton.click({ timeout });
      await this.page.waitForTimeout(500);
    } catch {
      // Баннера нет (уже принят или не показан) — это нормально.
    }
  }

  async decline(): Promise<void> {
    await this.declineButton.click();
  }
}
