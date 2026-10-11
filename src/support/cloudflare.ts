import { Page } from '@playwright/test';

/**
 * Ожидание прохождения Cloudflare-проверки («Just a moment…»).
 * Сайт защищён Cloudflare, поэтому каждая навигация начинается с этого шага.
 */
export async function waitForCloudflare(page: Page, timeout = 45_000): Promise<void> {
  await page.waitForFunction(() => !document.title.includes('Just a moment'), null, { timeout });
}
