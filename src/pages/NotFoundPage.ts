import { Locator, Page, Response } from '@playwright/test';
import { BasePage } from './BasePage';
import { NOT_FOUND_PATH } from '../config';
import { waitForCloudflare } from '../support/cloudflare';

/** Страница 404 для заведомо несуществующего URL. */
export class NotFoundPage extends BasePage {
  readonly homeLinks: Locator;

  constructor(page: Page) {
    super(page, NOT_FOUND_PATH);
    this.homeLinks = page.locator('a[href="/"], a[href="https://3s.money/"]');
  }

  /**
   * Открыть несуществующий URL и вернуть HTTP-ответ.
   * Cloudflare на 404 может не показать челлендж, поэтому его ожидание не обязательно.
   */
  async openAndGetResponse(): Promise<Response | null> {
    const resp = await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await waitForCloudflare(this.page).catch(() => {});
    await this.cookieBanner.acceptAllIfShown();
    return resp;
  }

  async mentionsNotFound(): Promise<boolean> {
    const title = await this.page.title();
    const body = await this.bodyText();
    return /not found|404|doesn'?t exist|page you.*looking for/i.test(`${title} ${body}`);
  }
}
