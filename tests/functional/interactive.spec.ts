import { Page } from '@playwright/test';
import { test, expect } from '../../src';

/**
 * Интерактивные элементы: дропдауны меню, аккордеоны, демо-виджет портала,
 * эвристика «мёртвых кнопок» (клик не производит никакого эффекта).
 */

/** Счётчик мутаций DOM: «живая» кнопка меняет документ или URL. */
async function startMutationCounter(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as any).__mutations = 0;
    new MutationObserver((list) => {
      (window as any).__mutations += list.length;
    }).observe(document.body, { subtree: true, childList: true, attributes: true });
  });
}

async function mutationCount(page: Page): Promise<number> {
  return page.evaluate(() => (window as any).__mutations ?? 0);
}

test.describe('Интерактив', () => {
  test('меню Solutions открывается и ведёт на страницу решения', async ({ homePage, page }) => {
    await homePage.open();
    const { header } = homePage;

    await expect(header.solutionsTrigger, 'Пункт меню Solutions не найден').toBeAttached();
    await header.openSolutionsMenu();

    const item = header.menuLink('/solutions/global-accounts');
    await expect(item, 'Подпункт Global accounts недоступен после открытия меню').toBeVisible({ timeout: 10_000 });
    await item.click({ force: true });
    await page.waitForURL(/solutions\/global-accounts/, { timeout: 20_000 });
    await expect(homePage.h1).toBeVisible();
  });

  test('аккордеоны в help-centre раскрываются и содержат контент', async ({ helpCentrePage }) => {
    await helpCentrePage.open();

    const count = await helpCentrePage.accordionTitles.count();
    expect(count, 'Аккордеоны на help-centre не найдены').toBeGreaterThan(2);

    // Берём второй аккордеон (первый может быть раскрыт по умолчанию).
    const index = 1;
    const wasActive = await helpCentrePage.isAccordionActive(index);
    await helpCentrePage.toggleAccordion(index);
    const isActive = await helpCentrePage.isAccordionActive(index);

    expect(
      isActive !== wasActive,
      `Клик по аккордеону не переключил состояние (activeAccordion: ${wasActive} → ${isActive})`
    ).toBeTruthy();
    expect((await helpCentrePage.accordionText(index)).length, 'Раскрытый аккордеон пуст').toBeGreaterThan(20);
  });

  test('демо-виджет клиентского портала: дропдаун счетов открывается', async ({ homePage, page }) => {
    await homePage.open();

    const dd = homePage.portalAccountsDropdown;
    await expect(dd, 'Дропдаун демо-виджета не найден').toBeVisible({ timeout: 15_000 });
    await dd.scrollIntoViewIfNeeded();
    await dd.click();
    await page.waitForTimeout(800);

    expect(await homePage.portalDropdownOptions.count(), 'Дропдаун открылся без опций').toBeGreaterThan(0);
  });

  test('эвристика «мёртвых кнопок»: клики по кнопкам главной производят эффект', async ({ homePage, page }) => {
    test.setTimeout(180_000);
    await homePage.open();
    await startMutationCounter(page);

    const buttons = homePage.contentButtons;
    const total = Math.min(await buttons.count(), 8);
    const dead: string[] = [];

    for (let i = 0; i < total; i++) {
      const btn = buttons.nth(i);
      const label = ((await btn.textContent()) || (await btn.getAttribute('aria-label')) || `#${i}`)
        .trim()
        .slice(0, 40);
      const urlBefore = page.url();
      await btn.scrollIntoViewIfNeeded().catch(() => {});
      const before = await mutationCount(page);
      await btn.click({ force: true, timeout: 5_000 }).catch(() => {});
      await page.waitForTimeout(1_200);

      if (page.url() !== urlBefore) {
        // Кнопка увела со страницы — живая; возвращаемся.
        await homePage.open();
        await startMutationCounter(page);
        continue;
      }
      if ((await mutationCount(page)) === before) dead.push(label);
    }

    test.info().annotations.push({ type: 'info', description: `Проверено кнопок: ${total}` });
    expect(dead, `«Мёртвые» кнопки (клик без эффекта): ${JSON.stringify(dead)}`).toEqual([]);
  });
});
