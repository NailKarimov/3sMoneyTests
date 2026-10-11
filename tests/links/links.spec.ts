import { test, expect, gotoPage } from '../../src';

/**
 * Тестирование ссылок: корректность href на главной странице
 * и доступность внутренних страниц (проверка на битые ссылки).
 */
test.describe('Ссылки', () => {
  test('на главной нет ссылок с неподставленными плейсхолдерами или мусорными href', async ({ page }) => {
    await gotoPage(page, '/');

    const hrefs: string[] = await page.$$eval('a[href]', (as) =>
      as.map((a) => a.getAttribute('href') || '')
    );

    const bad = hrefs.filter(
      (h) =>
        /\[#.*#\]/.test(h) || // неподставленный шаблон вида [#VAR#]
        /undefined|null/.test(h) ||
        h.trim() === ''
    );
    expect(bad, `Мусорные href: ${JSON.stringify(bad)}`).toEqual([]);
  });

  test('на главной нет "пустых" ссылок-заглушек href="#"', async ({ page }) => {
    await gotoPage(page, '/');
    const stubs: string[] = await page.$$eval('a[href="#"]', (as) =>
      as.map((a) => (a.textContent || '').trim().slice(0, 50))
    );
    expect(stubs, `Ссылки-заглушки href="#": ${JSON.stringify(stubs)}`).toEqual([]);
  });

  test('внутренние ссылки главной не ведут на 404/5xx', async ({ page }) => {
    test.setTimeout(240_000);
    await gotoPage(page, '/');

    const origin = 'https://3s.money';
    let links: string[] = await page.$$eval(
      'a[href]',
      (as, origin) => {
        const urls = as
          .map((a) => {
            try {
              return new URL(a.getAttribute('href')!, location.href).href;
            } catch {
              return null;
            }
          })
          .filter(
            (h): h is string =>
              !!h && h.startsWith(origin) && !h.includes('#') && !h.includes('[')
          );
        return [...new Set(urls)];
      },
      origin
    );
    links = links.slice(0, 25); // ограничиваем выборку, чтобы не злить Cloudflare

    const broken: string[] = [];
    const blocked: string[] = [];
    for (const url of links) {
      const resp = await page.request.get(url, { timeout: 20_000 }).catch(() => null);
      if (!resp) {
        broken.push(`${url} — нет ответа`);
      } else if (resp.status() === 403 || resp.status() === 429) {
        blocked.push(url); // заблокировано Cloudflare — не считаем багом сайта
      } else if (resp.status() >= 400) {
        broken.push(`${url} — HTTP ${resp.status()}`);
      }
    }

    test.info().annotations.push({
      type: 'info',
      description: `Проверено ссылок: ${links.length}, заблокировано CF: ${blocked.length}`,
    });
    expect(broken, `Битые ссылки:\n${broken.join('\n')}`).toEqual([]);
  });

  test('ссылки на внешние ресурсы открываются в новой вкладке с rel=noopener', async ({ page }) => {
    await gotoPage(page, '/');
    const unsafe: string[] = await page.$$eval('a[target="_blank"]', (as) =>
      as
        .filter((a) => {
          const rel = (a.getAttribute('rel') || '').toLowerCase();
          return !rel.includes('noopener') && !rel.includes('noreferrer');
        })
        .map((a) => a.getAttribute('href') || '')
        .slice(0, 20)
    );
    expect(
      unsafe,
      `target=_blank без rel=noopener/noreferrer: ${JSON.stringify(unsafe)}`
    ).toEqual([]);
  });
});
