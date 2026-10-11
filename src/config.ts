/**
 * Общие константы тестового стенда.
 */
export const BASE_URL = 'https://3s.money';

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

/** Заведомо несуществующий путь для негативных проверок. */
export const NOT_FOUND_PATH = '/definitely-not-a-page-xyz-123';

/** Шум сторонних трекеров в консоли: эти ошибки не считаем ошибками сайта. */
export const THIRD_PARTY_NOISE = /hubspot|linkedin|facebook|hotjar|clarity|doubleclick|google|bing/i;

/** Признак собственного ресурса сайта (сам домен и CMS Storyblok). */
export function isOwnResource(url: string): boolean {
  return url.includes('3s.money') || url.includes('storyblok.com');
}
