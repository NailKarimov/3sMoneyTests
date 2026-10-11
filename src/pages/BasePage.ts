import { Locator, Page } from '@playwright/test';
import { waitForCloudflare } from '../support/cloudflare';
import { CookieBanner } from '../components/CookieBanner';
import { Header } from '../components/Header';

/**
 * Базовая страница: навигация с прохождением Cloudflare и закрытием cookie-баннера,
 * общие элементы (шапка, h1, текст страницы).
 */
export class BasePage {
  readonly header: Header;
  readonly cookieBanner: CookieBanner;
  readonly h1: Locator;

  constructor(readonly page: Page, readonly path: string = '/') {
    this.header = new Header(page);
    this.cookieBanner = new CookieBanner(page);
    this.h1 = page.locator('h1').first();
  }

  /** Открыть страницу: goto → Cloudflare → закрыть cookie-баннер. */
  async open(): Promise<this> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await waitForCloudflare(this.page);
    await this.cookieBanner.acceptAllIfShown();
    return this;
  }

  /** Открыть страницу, не трогая cookie-баннер (для GDPR-проверок). */
  async openWithoutConsent(): Promise<this> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await waitForCloudflare(this.page);
    return this;
  }

  async bodyText(): Promise<string> {
    return this.page.locator('body').innerText();
  }
}

/**
 * Открыть произвольный путь как BasePage.
 * Для тестов, которым не нужен отдельный page object (SEO, perf, ссылки).
 */
export async function gotoPage(page: Page, path: string = '/'): Promise<BasePage> {
  return new BasePage(page, path).open();
}
