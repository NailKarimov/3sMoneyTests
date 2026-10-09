import { test, expect } from '@playwright/test';
import { gotoPage } from '../helpers';

/**
 * Базовые проверки производительности главной страницы.
 * Пороги мягкие: сайт за Cloudflare, замеры в headed-режиме нестабильны.
 */
test.describe('Производительность', () => {
  test('метрики загрузки главной в разумных пределах', async ({ page }) => {
    await gotoPage(page, '/');

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        ttfb: Math.round(nav.responseStart - nav.requestStart),
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        load: Math.round(nav.loadEventEnd - nav.startTime),
        transferSizeKb: Math.round(nav.transferSize / 1024),
      };
    });

    test.info().annotations.push({
      type: 'perf',
      description: `TTFB=${metrics.ttfb}ms, DCL=${metrics.domContentLoaded}ms, load=${metrics.load}ms, HTML=${metrics.transferSizeKb}KB`,
    });

    expect(metrics.ttfb, `TTFB слишком велик: ${metrics.ttfb}ms`).toBeLessThan(3_000);
    expect(
      metrics.domContentLoaded,
      `DOMContentLoaded слишком долгий: ${metrics.domContentLoaded}ms`
    ).toBeLessThan(10_000);
  });

  test('главная не грузит чрезмерный объём данных (< 15 МБ)', async ({ page }) => {
    // Считаем реально переданные байты: content-length отсутствует
    // у chunked-ответов, и по нему объём страницы занижается.
    let totalBytes = 0;
    page.on('requestfinished', async (req) => {
      const sizes = await req.sizes().catch(() => null);
      if (sizes) totalBytes += sizes.responseBodySize + sizes.responseHeadersSize;
    });

    await gotoPage(page, '/');
    await page.waitForTimeout(3_000);

    const totalMb = totalBytes / 1024 / 1024;
    test.info().annotations.push({
      type: 'perf',
      description: `Загружено ~${totalMb.toFixed(1)} МБ`,
    });
    expect(totalMb, `Страница загрузила ${totalMb.toFixed(1)} МБ`).toBeLessThan(15);
  });
});
