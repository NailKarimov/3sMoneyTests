import AxeBuilder from '@axe-core/playwright';
import { test, expect, gotoPage, CookieBanner, knownBug } from '../../src';

/**
 * Тестирование доступности (a11y) по WCAG 2.2 A/AA (основа EN 301 549 V4.1.1)
 * с помощью axe-core. Cookie-баннер исключаем — это сторонний виджет.
 */
const PAGES = ['/', '/contact-us', '/pricing'];

test.describe('Доступность (axe-core, WCAG 2.2 A/AA)', () => {
  for (const path of PAGES) {
    test(`страница ${path}: нет критичных нарушений доступности`, async ({ page }) => {
      test.setTimeout(120_000);
      knownBug('BUG-004');
      await gotoPage(page, path);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .exclude(CookieBanner.SELECTOR)
        .exclude('iframe')
        .analyze();

      const severe = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      const report = severe
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.help} (узлов: ${v.nodes.length})\n  пример: ${v.nodes[0]?.html?.slice(0, 150)}`
        )
        .join('\n');

      // Менее серьёзные нарушения фиксируем в аннотациях, не роняя тест.
      const minor = results.violations.filter(
        (v) => v.impact !== 'critical' && v.impact !== 'serious'
      );
      test.info().annotations.push({
        type: 'a11y-minor',
        description: minor.map((v) => `${v.id} (${v.impact}, узлов: ${v.nodes.length})`).join('; ') || 'нет',
      });

      expect(severe, `Серьёзные нарушения a11y:\n${report}`).toEqual([]);
    });
  }
});
