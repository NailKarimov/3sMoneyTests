import { test, expect, knownBug } from '../../src';

/**
 * Адаптивность: сайт корректно отображается на мобильном,
 * планшете и десктопе — нет горизонтальной прокрутки, контент виден.
 */
const VIEWPORTS = [
  { name: 'mobile (iPhone 375x812)', width: 375, height: 812 },
  { name: 'tablet (768x1024)', width: 768, height: 1024 },
  { name: 'desktop (1440x900)', width: 1440, height: 900 },
];

test.describe('Адаптивность', () => {
  for (const vp of VIEWPORTS) {
    test(`${vp.name}: нет горизонтального скролла, контент виден`, async ({ homePage, page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await homePage.open();

      // Горизонтальное переполнение — типичный баг адаптивной вёрстки.
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        overflow.scrollWidth,
        `Горизонтальный скролл: контент ${overflow.scrollWidth}px при окне ${overflow.clientWidth}px`
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);

      // Главный заголовок должен быть виден на любом устройстве.
      await expect(homePage.h1).toBeVisible();
    });
  }

  test('mobile: бургер-меню открывается и показывает навигационные ссылки', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await homePage.open();
    await homePage.mobileMenu.openByPointer();
    expect(
      await homePage.mobileMenu.visibleLinksCount(),
      'После клика по бургеру навигационные ссылки не появились'
    ).toBeGreaterThan(0);
  });

  test('mobile: бургер-меню реализовано семантической кнопкой <button>', async ({ homePage, page }) => {
    knownBug('BUG-002');
    await page.setViewportSize({ width: 375, height: 812 });
    await homePage.open();
    expect(
      await homePage.mobileMenu.semanticBurger.count(),
      'Бургер-меню не является <button> и недоступно с клавиатуры/скринридера'
    ).toBeGreaterThan(0);
  });
});
