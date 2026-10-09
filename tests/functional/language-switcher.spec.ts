import { test, expect } from '@playwright/test';
import { gotoPage } from '../helpers';

/**
 * Переключатель языка (Weglot): ENG / FR / AR.
 * Проверяем смену языка контента, RTL для арабского и целостность вёрстки.
 */
test.describe('Переключатель языка', () => {
  test('в шапке доступны языки ENG, FR и AR', async ({ page }) => {
    await gotoPage(page, '/');
    for (const lang of ['ENG', 'FR', 'AR']) {
      const el = page.locator(`[id="navigation (new)"] :text-is("${lang}"), header :text-is("${lang}")`).first();
      expect(await el.count(), `Пункт языка "${lang}" не найден в навигации`).toBeGreaterThan(0);
    }
  });

  test('переключение на французский меняет язык контента', async ({ page }) => {
    test.setTimeout(120_000);
    await gotoPage(page, '/');

    const before = (await page.locator('h1').first().textContent())?.trim() || '';

    // Открываем языковой дропдаун (ENG) и выбираем FR.
    await page.locator(':text-is("ENG")').locator('visible=true').first().click({ force: true });
    await page.waitForTimeout(800);
    await page.locator(':text-is("FR")').locator('visible=true').first().click({ force: true });

    // Weglot либо меняет lang на месте, либо перезагружает страницу.
    await page
      .waitForFunction(() => document.documentElement.lang.toLowerCase().startsWith('fr'), null, { timeout: 20_000 })
      .catch(() => {});
    await page.waitForTimeout(2_000);

    const lang = await page.locator('html').getAttribute('lang');
    const after = (await page.locator('h1').first().textContent())?.trim() || '';
    const switched = lang?.toLowerCase().startsWith('fr') || (after !== before && after.length > 0);
    expect(switched, `Контент не переключился на FR: lang="${lang}", h1 "${after}"`).toBeTruthy();
  });

  test('арабский: включается RTL и вёрстка не ломается', async ({ page }) => {
    test.setTimeout(120_000);
    await gotoPage(page, '/');

    await page.locator(':text-is("ENG")').locator('visible=true').first().click({ force: true });
    await page.waitForTimeout(800);
    await page.locator(':text-is("AR")').locator('visible=true').first().click({ force: true });

    await page
      .waitForFunction(() => document.documentElement.lang.toLowerCase().startsWith('ar'), null, { timeout: 20_000 })
      .catch(() => {});
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
