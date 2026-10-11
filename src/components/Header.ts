import { Locator, Page } from '@playwright/test';

export type Language = 'ENG' | 'FR' | 'AR';

/**
 * Шапка сайта: десктопная навигация, меню Solutions, переключатель языка (Weglot), логотип.
 */
export class Header {
  readonly nav: Locator;
  readonly solutionsTrigger: Locator;
  readonly logoLink: Locator;
  readonly contactLink: Locator;

  constructor(private readonly page: Page) {
    this.nav = page.locator('[id="navigation (new)"]');
    this.solutionsTrigger = this.nav.locator(':text-is("Solutions")').first();
    // На внутренних страницах логотип — svg без alt-текста, поэтому ищем по href.
    this.logoLink = page
      .locator('#navigationMobile a[href="/"], [id*="navigation"] a[href="/"], header a[href="/"]')
      .first();
    this.contactLink = page.locator('a[href*="contact-us"]').first();
  }

  /** Пункт языка в навигации (может быть скрыт до открытия дропдауна). */
  languageItem(lang: Language): Locator {
    return this.page
      .locator(`[id="navigation (new)"] :text-is("${lang}"), header :text-is("${lang}")`)
      .first();
  }

  /** Подпункт выпадающего меню по части href. */
  menuLink(hrefPart: string): Locator {
    return this.page.locator(`a[href*="${hrefPart}"]`).first();
  }

  async openSolutionsMenu(): Promise<void> {
    await this.solutionsTrigger.hover();
    await this.page.waitForTimeout(500);
    await this.solutionsTrigger.click({ force: true });
    await this.page.waitForTimeout(800);
  }

  /**
   * Открывает языковой дропдаун (по текущему ENG) и выбирает язык.
   * Weglot либо меняет lang на месте, либо перезагружает страницу — ждём оба варианта.
   */
  async switchLanguage(lang: Exclude<Language, 'ENG'>): Promise<void> {
    await this.page.locator(':text-is("ENG")').locator('visible=true').first().click({ force: true });
    await this.page.waitForTimeout(800);
    await this.page.locator(`:text-is("${lang}")`).locator('visible=true').first().click({ force: true });

    const prefix = lang.toLowerCase();
    await this.page
      .waitForFunction(
        (p) => document.documentElement.lang.toLowerCase().startsWith(p),
        prefix,
        { timeout: 20_000 }
      )
      .catch(() => {});
  }
}
