import { Locator, Page } from '@playwright/test';

/**
 * Мобильное бургер-меню (#navigationMobile).
 * Известный дефект BUG-002: бургер собран из div без роли кнопки,
 * поэтому открываем его кликом мыши по области в правом верхнем углу.
 */
export class MobileMenu {
  readonly root: Locator;
  /** Ожидаемая семантическая кнопка бургера — сейчас на сайте её нет. */
  readonly semanticBurger: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('#navigationMobile');
    this.semanticBurger = page.locator(
      '#navigationMobile button:visible, header button:visible, [role="button"][aria-label*="menu" i]:visible'
    );
  }

  /** Клик по области бургера для viewport 375px. */
  async openByPointer(): Promise<void> {
    await this.page.mouse.click(340, 33);
    await this.page.waitForTimeout(1_500);
  }

  async visibleLinksCount(): Promise<number> {
    return this.page.evaluate(
      () =>
        [...document.querySelectorAll('#navigationMobile a')].filter((a) => {
          const r = a.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }).length
    );
  }
}
