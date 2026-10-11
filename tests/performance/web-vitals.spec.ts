import { test, expect, gotoPage } from '../../src';

/**
 * Core Web Vitals: LCP и CLS главной страницы.
 * Пороги — по границе «poor» от Google (LCP > 4s, CLS > 0.25),
 * чтобы тест ловил реальные проблемы, а не сетевые флуктуации.
 */
test.describe('Web Vitals', () => {
  test('LCP и CLS главной в допустимых пределах', async ({ page }) => {
    test.setTimeout(120_000);

    // Подписываемся на метрики до загрузки страницы.
    await page.addInitScript(() => {
      (window as any).__vitals = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          (window as any).__vitals.lcp = e.startTime;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as any[]) {
          if (!e.hadRecentInput) (window as any).__vitals.cls += e.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await gotoPage(page, '/');
    // Даём странице дожить до стабильного состояния и фиксируем сдвиги.
    await page.waitForTimeout(6_000);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(2_000);

    const vitals = await page.evaluate(() => (window as any).__vitals);

    test.info().annotations.push({
      type: 'web-vitals',
      description: `LCP=${Math.round(vitals.lcp)}ms (good<2500, poor>4000), CLS=${vitals.cls.toFixed(3)} (good<0.1, poor>0.25)`,
    });

    expect(vitals.lcp, `LCP ${Math.round(vitals.lcp)}ms — хуже порога "poor" (4000ms)`).toBeLessThan(4_000);
    expect(vitals.cls, `CLS ${vitals.cls.toFixed(3)} — хуже порога "poor" (0.25)`).toBeLessThan(0.25);
  });
});
