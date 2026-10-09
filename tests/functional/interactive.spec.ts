import { test, expect } from '@playwright/test';
import { gotoPage } from '../helpers';

/**
 * Интерактивные элементы: дропдауны меню, аккордеоны, демо-виджет портала,
 * эвристика «мёртвых кнопок» (клик не производит никакого эффекта).
 */
test.describe('Интерактив', () => {
  test('меню Solutions открывается и ведёт на страницу решения', async ({ page }) => {
    await gotoPage(page, '/');

    const trigger = page.locator('[id="navigation (new)"] :text-is("Solutions")').first();
    await expect(trigger, 'Пункт меню Solutions не найден').toBeAttached();
    await trigger.hover();
    await page.waitForTimeout(500);
    await trigger.click({ force: true });
    await page.waitForTimeout(800);

    const item = page.locator('a[href*="/solutions/global-accounts"]').first();
    await expect(item, 'Подпункт Global accounts недоступен после открытия меню').toBeVisible({ timeout: 10_000 });
    await item.click({ force: true });
    await page.waitForURL(/solutions\/global-accounts/, { timeout: 20_000 });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('аккордеоны в help-centre раскрываются и содержат контент', async ({ page }) => {
    await gotoPage(page, '/help-centre');

    const titles = page.locator('[class*="AccordionPanel_title"]');
    const count = await titles.count();
    expect(count, 'Аккордеоны на help-centre не найдены').toBeGreaterThan(2);

    // Берём второй аккордеон (первый может быть раскрыт по умолчанию).
    const target = titles.nth(1);
    await target.scrollIntoViewIfNeeded();

    // Состояние аккордеона кодируется классом AccordionPanel_activeAccordion.
    const panel = page.locator('[class*="AccordionPanel_accordionPanel"]').nth(1);
    const wasActive = /activeAccordion/.test((await panel.getAttribute('class')) || '');

    await target.click();
    await page.waitForTimeout(1_000);
    const isActive = /activeAccordion/.test((await panel.getAttribute('class')) || '');

    expect(
      isActive !== wasActive,
      `Клик по аккордеону не переключил состояние (activeAccordion: ${wasActive} → ${isActive})`
    ).toBeTruthy();
    const text = (await panel.locator('[class*="AccordionPanel_content"]').first().textContent())?.trim() || '';
    expect(text.length, 'Раскрытый аккордеон пуст').toBeGreaterThan(20);
  });

  test('демо-виджет клиентского портала: дропдаун счетов открывается', async ({ page }) => {
    await gotoPage(page, '/');

    const dd = page.locator('[role="button"][aria-haspopup="listbox"]:visible').first();
    await expect(dd, 'Дропдаун демо-виджета не найден').toBeVisible({ timeout: 15_000 });
    await dd.scrollIntoViewIfNeeded();
    await dd.click();
    await page.waitForTimeout(800);

    const options = page.locator('[role="option"]:visible, [role="listbox"] li:visible');
    expect(await options.count(), 'Дропдаун открылся без опций').toBeGreaterThan(0);
  });

  test('эвристика «мёртвых кнопок»: клики по кнопкам главной производят эффект', async ({ page }) => {
    test.setTimeout(180_000);
    await gotoPage(page, '/');

    // Наблюдаем за мутациями DOM — «живая» кнопка меняет документ или URL.
    await page.evaluate(() => {
      (window as any).__mutations = 0;
      new MutationObserver((list) => {
        (window as any).__mutations += list.length;
      }).observe(document.body, { subtree: true, childList: true, attributes: true });
    });

    const buttons = page.locator('main button:visible, [class*="Hero"] button:visible');
    const total = Math.min(await buttons.count(), 8);
    const dead: string[] = [];

    for (let i = 0; i < total; i++) {
      const btn = buttons.nth(i);
      const label = ((await btn.textContent()) || (await btn.getAttribute('aria-label')) || `#${i}`)
        .trim()
        .slice(0, 40);
      const urlBefore = page.url();
      await btn.scrollIntoViewIfNeeded().catch(() => {});
      const before = await page.evaluate(() => (window as any).__mutations ?? 0);
      await btn.click({ force: true, timeout: 5_000 }).catch(() => {});
      await page.waitForTimeout(1_200);

      if (page.url() !== urlBefore) {
        // Кнопка увела со страницы — живая; возвращаемся.
        await gotoPage(page, '/');
        await page.evaluate(() => {
          (window as any).__mutations = 0;
          new MutationObserver((list) => {
            (window as any).__mutations += list.length;
          }).observe(document.body, { subtree: true, childList: true, attributes: true });
        });
        continue;
      }
      const after = await page.evaluate(() => (window as any).__mutations ?? 0);
      if (after === before) dead.push(label);
    }

    test.info().annotations.push({ type: 'info', description: `Проверено кнопок: ${total}` });
    expect(dead, `«Мёртвые» кнопки (клик без эффекта): ${JSON.stringify(dead)}`).toEqual([]);
  });
});
