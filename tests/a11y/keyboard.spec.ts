import { test, expect, collectTabStops, knownBug } from '../../src';

/**
 * Клавиатурная доступность по WCAG 2.2:
 * 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.7 Focus Visible,
 * 2.4.11 Focus Not Obscured (Minimum).
 * Проверяем первые 40 остановок фокуса при нажатии Tab на главной.
 */
const TAB_PRESSES = 40;

test.describe('Доступность: навигация с клавиатуры (WCAG 2.2)', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('Tab проходит по интерактивным элементам без ловушки фокуса (2.1.1, 2.1.2)', async ({ page }) => {
    const stops = await collectTabStops(page, TAB_PRESSES);
    const onPage = stops.filter((s) => !s.onBody);
    const unique = new Set(onPage.map((s) => s.key));

    // Ловушка: фокус три раза подряд остаётся на одном и том же элементе.
    const trapped = stops.find(
      (s, i) => i >= 2 && !s.onBody && s.key === stops[i - 1].key && s.key === stops[i - 2].key,
    );

    test.info().annotations.push({
      type: 'tab-order',
      description: onPage.slice(0, 15).map((s) => `${s.index}. ${s.label}`).join('\n'),
    });

    expect(unique.size, 'Клавиатурой достижимо слишком мало элементов').toBeGreaterThan(10);
    expect(trapped, `Ловушка фокуса на элементе: ${trapped?.label}`).toBeUndefined();
  });

  test('у элемента в фокусе есть видимый индикатор фокуса (2.4.7)', async ({ page }) => {
    knownBug('BUG-010');
    const stops = (await collectTabStops(page, TAB_PRESSES)).filter((s) => !s.onBody);
    const invisible = stops.filter((s) => !s.hasFocusIndicator);

    test.info().annotations.push({
      type: 'focus-visible',
      description: `Без индикатора фокуса: ${invisible.length} из ${stops.length}`,
    });

    expect(
      invisible.map((s) => `${s.index}. ${s.label}`),
      'Элементы без видимого индикатора фокуса',
    ).toEqual([]);
  });

  test('элемент в фокусе не скрыт за пределами экрана (2.4.11)', async ({ page }) => {
    const stops = (await collectTabStops(page, TAB_PRESSES)).filter((s) => !s.onBody);
    const hidden = stops.filter((s) => !s.inViewport);

    expect(
      hidden.map((s) => `${s.index}. ${s.label}`),
      'Фокус уходит на элементы вне видимой области',
    ).toEqual([]);
  });
});
