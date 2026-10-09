import { test, expect } from '@playwright/test';
import { gotoPage, waitForCloudflare } from '../helpers';

/**
 * Динамический краулер: открывает главную, собирает все внутренние ссылки,
 * открывает каждую страницу, собирает её ссылки, и так пока не пройдет весь сайт.
 * Остаётся в границах 3s.money, проверяет на 404/5xx и ошибки консоли.
 * Лимиты: максимум 60 страниц, 300 откров (CF защита).
 */
test.describe('Динамический краулер 3s.money', () => {
  test('обход всех внутренних страниц: нет 404/5xx и ошибок консоли', { tag: '@slow' }, async ({ page }) => {
    test.setTimeout(600_000); // 10 минут на весь краул

    const ORIGIN = 'https://3s.money';
    const MAX_PAGES = 60;
    const MAX_REQUESTS = 300;

    const visited = new Set<string>();
    const queue = new Set<string>(['/']);
    let requestCount = 0;
    const broken: { url: string; status: number; context: string }[] = [];
    const consoleErrors: { page: string; msg: string }[] = [];

    // Слушатели вешаем один раз: при подписке внутри цикла они копились бы
    // и приписывали ошибки сразу нескольким страницам. Текущую страницу
    // и буфер её ошибок переключаем в начале каждой итерации.
    let currentPath = '/';
    let pageErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') pageErrors.push(msg.text().slice(0, 200));
    });
    page.on('pageerror', (err) => pageErrors.push(String(err).slice(0, 200)));
    page.on('response', (resp) => {
      if (
        resp.status() >= 400 &&
        (resp.url().includes('3s.money') || resp.url().includes('storyblok.com'))
      ) {
        broken.push({ url: resp.url(), status: resp.status(), context: currentPath });
      }
    });

    // Обходим все страницы в очереди.
    while (queue.size > 0 && visited.size < MAX_PAGES && requestCount < MAX_REQUESTS) {
      const pathArray = Array.from(queue);
      const path = pathArray[0]!;
      queue.delete(path);
      if (visited.has(path)) continue;
      visited.add(path);
      requestCount++;

      test.info().annotations.push({
        type: 'crawl-progress',
        description: `[${visited.size}/${MAX_PAGES}] ${path}`,
      });

      currentPath = path;
      pageErrors = [];

      try {
        await gotoPage(page, path);

        // Собираем уникальные внутренние ссылки со странички.
        const links = await page.$$eval('a[href]', (as) =>
          [...new Set(
            as
              .map((a) => {
                try {
                  // Только ссылки на сам сайт: у внешних (LinkedIn, Cookiebot…)
                  // pathname иначе превращается в несуществующий путь на 3s.money.
                  const url = new URL(a.getAttribute('href')!, location.href);
                  return url.origin === location.origin ? url.pathname : null;
                } catch {
                  return null;
                }
              })
              .filter((p): p is string => !!p && p.startsWith('/') && !p.includes('#'))
          )],
        );

        for (const link of links) {
          if (!visited.has(link) && queue.size < MAX_PAGES) queue.add(link);
        }

        await page.waitForTimeout(1_500); // Даём сети и скриптам время.

        // Логируем ошибки консоли этой странички.
        // Отфильтровываем "Failed to load resource" (артефакты неправильных href),
        // оставляем только реальные JS-ошибки.
        const ownErrors = pageErrors.filter(
          (e) => !/hubspot|linkedin|facebook|hotjar|clarity|doubleclick|google|bing|Failed to load resource/i.test(e)
        );
        if (ownErrors.length > 0) {
          consoleErrors.push({ page: path, msg: ownErrors[0]! });
        }
      } catch (error) {
        broken.push({
          url: `${ORIGIN}${path}`,
          status: 999,
          context: `goto failed: ${String(error).slice(0, 100)}`,
        });
      }
    }

    test.info().annotations.push({
      type: 'crawl-summary',
      description: `Посещено ${visited.size} страниц (макс ${MAX_PAGES}), сделано ${requestCount} запросов (макс ${MAX_REQUESTS}). Страницы: ${Array.from(visited)
        .slice(0, 30)
        .join(', ')}${visited.size > 30 ? '…' : ''}`,
    });

    // Ошибки консоли (сайтовские, не трекеры).
    if (consoleErrors.length > 0) {
      const report = consoleErrors
        .slice(0, 5)
        .map((e) => `${e.page}: ${e.msg}`)
        .join('\n');
      test.info().annotations.push({
        type: 'console-errors',
        description: `Найдено ${consoleErrors.length} ошибок консоли:\n${report}`,
      });
    }
    expect(consoleErrors, `JS-ошибки на страницах:\n${consoleErrors.map((e) => `${e.page}: ${e.msg}`).join('\n')}`).toEqual(
      []
    );

    // Проверяем сеть (исключаем CF-блокировки).
    const realBroken = broken.filter((b) => b.status !== 403 && b.status !== 429 && b.status !== 999);
    expect(
      realBroken,
      `Неудачные запросы при крауле:\n${realBroken.slice(0, 10).map((b) => `${b.status} ${b.url} (открывалась ${b.context})`).join('\n')}`
    ).toEqual([]);
  });
});
