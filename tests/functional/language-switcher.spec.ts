import { test, expect } from '../../src';

/**
 * Переключатель языка (Weglot): ENG / FR / AR.
 * Проверяем смену языка контента, RTL для арабского и целостность вёрстки.
 */
test.describe('Переключатель языка', () => {
  test('в шапке доступны языки ENG, FR и AR', async ({ homePage }) => {
    await homePage.open();
    for (const lang of ['ENG', 'FR', 'AR'] as const) {
      expect(
        await homePage.header.languageItem(lang).count(),
        `Пункт языка "${lang}" не найден в навигации`
      ).toBeGreaterThan(0);
    }
  });

  test('переключение на французский меняет язык контента', async ({ homePage, page }) => {
    test.setTimeout(120_000);
    await homePage.open();
    const before = (await homePage.h1.textContent())?.trim() || '';

    await homePage.header.switchLanguage('FR');
    await page.waitForTimeout(2_000);

    const lang = await page.locator('html').getAttribute('lang');
    const after = (await homePage.h1.textContent())?.trim() || '';
    const switched = lang?.toLowerCase().startsWith('fr') || (after !== before && after.length > 0);
    expect(switched, `Контент не переключился на FR: lang="${lang}", h1 "${after}"`).toBeTruthy();
  });

  test('арабский: включается RTL и вёрстка не ломается', async ({ homePage, page }) => {
    test.setTimeout(120_000);
    await homePage.open();

    await homePage.header.switchLanguage('AR');
    await page.waitForTimeout(2_500);

    const state = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      dir: document.documentElement.dir || getComputedStyle(document.body).direction,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      h1: document.querySelector('h1')?.textContent?.trim().slice(0, 60) || '',
    }));

    test.info().annotations.push({
      type: 'info',
      description: `AR: lang=${state.lang}, dir=${state.dir}, h1="${state.h1}"`,
    });

    expect(
      state.lang.toLowerCase().startsWith('ar') || /[؀-ۿ]/.test(state.h1),
      `Контент не переключился на арабский: lang="${state.lang}", h1="${state.h1}"`
    ).toBeTruthy();
    expect(state.dir, 'Для арабского не включён RTL (dir/direction)').toBe('rtl');
    expect(
      state.scrollWidth,
      `RTL сломал вёрстку: горизонтальный скролл ${state.scrollWidth}px при окне ${state.clientWidth}px`
    ).toBeLessThanOrEqual(state.clientWidth + 1);
  });
});
