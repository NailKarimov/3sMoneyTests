import { Page } from '@playwright/test';

/** Ожидание прохождения Cloudflare-проверки (без закрытия cookie-баннера). */
export async function waitForCloudflare(page: Page): Promise<void> {
  await page.waitForFunction(
    () => !document.title.includes('Just a moment'),
    null,
    { timeout: 45_000 }
  );
}

/**
 * Переход на страницу с ожиданием прохождения Cloudflare-проверки
 * и закрытием cookie-баннера (Cookiebot), который перекрывает контент.
 */
export async function gotoPage(page: Page, path: string = '/'): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await waitForCloudflare(page);
  await dismissCookieBanner(page);
}

export async function dismissCookieBanner(page: Page): Promise<void> {
  const allowAll = page.locator(
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'
  );
  try {
    await allowAll.click({ timeout: 5_000 });
    await page.waitForTimeout(500);
  } catch {
    // Баннера нет (уже принят или не показан) — это нормально.
  }
}

/** Ключевые внутренние страницы сайта для обхода в тестах. */
export const KEY_PAGES: { path: string; titlePart: RegExp }[] = [
  { path: '/', titlePart: /3S Money/i },
  { path: '/accounts', titlePart: /3S Money/i },
  { path: '/pricing', titlePart: /3S Money/i },
  { path: '/contact-us', titlePart: /contact/i },
  { path: '/our-story', titlePart: /3S Money/i },
  { path: '/help-centre', titlePart: /3S Money/i },
  { path: '/business-currency-exchange', titlePart: /3S Money/i },
  { path: '/careers', titlePart: /3S Money/i },
];
