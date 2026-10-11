import { test, expect, knownBug } from '../../src';

/**
 * GDPR / cookie-consent: до согласия пользователя не должны запускаться
 * маркетинговые и статистические трекеры и ставиться их куки.
 * Для UK-финтеха это комплаенс-требование, не мелочь.
 */
const TRACKER_PATTERNS: { name: string; re: RegExp }[] = [
  { name: 'Hotjar', re: /hotjar\.com|hotjar\.io/i },
  { name: 'Meta/Facebook', re: /facebook\.net|facebook\.com\/tr/i },
  { name: 'LinkedIn Ads', re: /px\.ads\.linkedin|linkedin\.com\/px/i },
  { name: 'DoubleClick', re: /doubleclick\.net/i },
  { name: 'Microsoft Clarity', re: /clarity\.ms/i },
  { name: 'Bing Ads', re: /bat\.bing\.com/i },
  { name: 'HubSpot Analytics', re: /hs-analytics\.net|track\.hubspot\.com/i },
  { name: 'Mailchimp', re: /chimpstatic|mailchimp\.com/i },
];

const TRACKING_COOKIES = ['_fbp', '_hjSession', 'hubspotutk', '_uetsid', '_clck'];

function collectTrackerHits(hits: string[]) {
  return (url: string) => {
    for (const t of TRACKER_PATTERNS) {
      if (t.re.test(url)) hits.push(`${t.name}: ${url.slice(0, 100)}`);
    }
  };
}

test.describe('Cookie-consent (GDPR)', () => {
  test('до взаимодействия с баннером маркетинговые трекеры не запускаются', async ({ homePage, page }) => {
    knownBug('BUG-009');
    const hits: string[] = [];
    page.on('request', (req) => collectTrackerHits(hits)(req.url()));

    await homePage.openWithoutConsent();
    // Баннер НЕ трогаем — просто ждём и наблюдаем за сетью.
    await page.waitForTimeout(8_000);

    expect(
      hits,
      `Трекеры сработали до согласия:\n${[...new Set(hits)].join('\n')}`
    ).toEqual([]);
  });

  test('до согласия не ставятся трекинговые куки', async ({ homePage, page, context }) => {
    knownBug('BUG-009');
    await homePage.openWithoutConsent();
    await page.waitForTimeout(6_000);

    const cookies = await context.cookies();
    const bad = cookies
      .map((c) => c.name)
      .filter((n) => TRACKING_COOKIES.some((t) => n.startsWith(t)));
    expect(bad, `Трекинговые куки до согласия: ${JSON.stringify(bad)}`).toEqual([]);
  });

  test('после отказа (Decline) трекеры по-прежнему молчат', async ({ homePage, page }) => {
    knownBug('BUG-009');
    await homePage.openWithoutConsent();

    const { declineButton } = homePage.cookieBanner;
    await expect(declineButton, 'Кнопка Decline в баннере не найдена').toBeVisible({ timeout: 15_000 });

    const hits: string[] = [];
    page.on('request', (req) => collectTrackerHits(hits)(req.url()));
    await homePage.cookieBanner.decline();
    await page.waitForTimeout(8_000);

    expect(
      hits,
      `Трекеры сработали после отказа:\n${[...new Set(hits)].join('\n')}`
    ).toEqual([]);
  });

  test('баннер согласия показывается при первом визите', async ({ homePage }) => {
    await homePage.openWithoutConsent();
    await expect(homePage.cookieBanner.root).toBeVisible({ timeout: 15_000 });
  });
});
