import { test, expect } from '@playwright/test';
import { gotoPage } from '../helpers';

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
    test(`${vp.name}: нет горизонтального скролла, контент виден`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await gotoPage(page, '/');

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
      await expect(page.locator('h1').first()).toBeVisible();
    });
  }

  test('mobile: бургер-меню открывается и показывает навигационные ссылки', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoPage(page, '/');

    // Бургер — обычные div'ы без роли кнопки, в дереве доступности его нет,
    // поэтому кликаем мышью по его области в правом верхнем углу.
    await page.mouse.click(340, 33);
    await page.waitForTimeout(1_500);

    const visibleLinks = await page.evaluate(
      () =>
        [...document.querySelectorAll('#navigationMobile a')].filter((a) => {
          const r = a.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }).length
    );
    expect(
      visibleLinks,
      'После клика по бургеру навигационные ссылки не появились'
    ).toBeGreaterThan(0);
  });

  test('mobile: бургер-меню реализовано семантической кнопкой <button>', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoPage(page, '/');

    const semanticBurger = page.locator(
      '#navigationMobile button:visible, header button:visible, [role="button"][aria-label*="menu" i]:visible'
    );
    expect(
      await semanticBurger.count(),
      'Бургер-меню не является <button> и недоступно с клавиатуры/скринридера'
    ).toBeGreaterThan(0);
  });
});
