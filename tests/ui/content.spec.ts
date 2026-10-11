import { test, expect, gotoPage, THIRD_PARTY_NOISE, isOwnResource } from '../../src';

/**
 * UI / контент: битые изображения, ошибки JS-консоли,
 * неудачные сетевые запросы собственных ресурсов сайта.
 */
test.describe('UI и контент', () => {
  test('на главной нет ошибок в консоли и необработанных исключений', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    // Ответы 429 — это ограничение частоты запросов Cloudflare (часто срабатывает
    // на IP облачного CI), а не ошибка сайта. Их и вызванные ими ошибки консоли не считаем.
    const throttled = new Set<string>();
    page.on('response', (resp) => {
      if (resp.status() === 429) throttled.add(resp.url());
    });

    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      const url = msg.location().url;
      const causedByThrottling =
        /status of 429/.test(text) ||
        (url && throttled.has(url)) ||
        [...throttled].some((u) => text.includes(u));
      if (!causedByThrottling) consoleErrors.push(text.slice(0, 200));
    });
    page.on('pageerror', (err) => pageErrors.push(String(err).slice(0, 200)));

    await gotoPage(page, '/');
    await page.waitForTimeout(3_000);

    // Отфильтровываем шум сторонних трекеров — нас интересуют ошибки самого сайта.
    const ownErrors = consoleErrors.filter(
      (e) => !THIRD_PARTY_NOISE.test(e)
    );

    expect(pageErrors, `Необработанные JS-исключения:\n${pageErrors.join('\n')}`).toEqual([]);
    expect(ownErrors, `Ошибки консоли:\n${ownErrors.join('\n')}`).toEqual([]);
  });

  test('собственные ресурсы сайта загружаются без 4xx/5xx', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (resp) => {
      const url = resp.url();
      if (isOwnResource(url) && resp.status() >= 400) {
        failed.push(`${resp.status()} ${url.slice(0, 120)}`);
      }
    });

    await gotoPage(page, '/');
    await page.waitForTimeout(3_000);

    expect(failed, `Неудачные запросы:\n${failed.join('\n')}`).toEqual([]);
  });

  test('видимые изображения на главной не битые', async ({ page }) => {
    test.setTimeout(120_000);
    await gotoPage(page, '/');

    // Прокручиваем страницу, чтобы сработала ленивая загрузка.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(2_000);

    const brokenImages: string[] = await page.$$eval('img', (imgs) =>
      imgs
        .filter((img) => {
          const style = window.getComputedStyle(img);
          const visible =
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            img.getBoundingClientRect().width > 0;
          return visible && img.complete && img.naturalWidth === 0 && !!img.src;
        })
        .map((img) => img.src.slice(0, 120))
        .slice(0, 15)
    );
    expect(brokenImages, `Битые изображения:\n${brokenImages.join('\n')}`).toEqual([]);
  });

  test('в тексте главной нет неподставленных шаблонов и артефактов вёрстки', async ({ page }) => {
    await gotoPage(page, '/');
    const body = await page.locator('body').innerText();
    const artifacts = body.match(/\{\{.*?\}\}|\[#.*?#\]|lorem ipsum/gi) || [];
    expect(artifacts, `Артефакты в тексте: ${JSON.stringify(artifacts)}`).toEqual([]);
  });
});
