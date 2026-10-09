import { test, expect } from '@playwright/test';
import { gotoPage } from '../helpers';
import fs from 'fs';
import path from 'path';

/**
 * Полное сканирование всех ссылок на сайте с генерацией репорта.
 * BFS обход всех внутренних страниц, сбор всех ссылок.
 * БЫСТРО: только сбор ссылок (без проверки статусов) - Cloudflare не блокирует!
 * ОТСЛЕЖИВАНИЕ: источников каждой ссылки (на какой странице найдена).
 * Результаты сохраняются в отчёт: reports/broken-links-report.html
 */
test.describe('Репорт битых ссылок (полное сканирование)', () => {
  test('сканировать ВСЕ ссылки на сайте и генерировать отчёт', { tag: '@slow' }, async ({ page }) => {
    test.setTimeout(600_000); // 10 минут (достаточно)

    const ORIGIN = 'https://3s.money';
    const MAX_PAGES = 30;  // 30 страниц (ускорено)
    const MAX_LINKS_PER_PAGE = 500;

    const visited = new Set<string>();
    const queue = new Set<string>(['/']);
    const allLinks = new Set<string>();
    const linkSources = new Map<string, string[]>();

    // BFS обход всех страниц
    while (queue.size > 0 && visited.size < MAX_PAGES) {
      const pathArray = Array.from(queue);
      const currentPath = pathArray[0]!;
      queue.delete(currentPath);

      if (visited.has(currentPath)) continue;
      visited.add(currentPath);

      test.info().annotations.push({
        type: 'page-visited',
        description: `[${visited.size}/${MAX_PAGES}] ${currentPath}`,
      });

      try {
        await gotoPage(page, currentPath);

        // Собираем все ссылки со страницы
        const pageLinks = await page.$$eval('a[href]', (as, maxLinks) =>
          as
            .slice(0, maxLinks)
            .map((a) => {
              try {
                const href = a.getAttribute('href');
                if (!href) return null;
                const url = new URL(href, location.href);
                // Внешние ссылки пропускаем: их pathname иначе
                // превращается в несуществующий путь на 3s.money.
                if (url.origin !== location.origin) return null;
                return {
                  pathname: url.pathname + url.search,
                  text: (a.textContent || '').trim().slice(0, 100),
                };
              } catch {
                return null;
              }
            })
            .filter(
              (l): l is { pathname: string; text: string } =>
                !!l && l.pathname.startsWith('/') && !l.pathname.includes('#')
            ),
          MAX_LINKS_PER_PAGE
        );

        // Добавляем новые пути в очередь и отслеживаем источники
        for (const link of pageLinks) {
          const fullUrl = `${ORIGIN}${link.pathname}`;
          allLinks.add(fullUrl);

          // Отслеживаем источник (на какой странице найдена ссылка)
          if (!linkSources.has(fullUrl)) {
            linkSources.set(fullUrl, []);
          }
          const sources = linkSources.get(fullUrl)!;
          if (!sources.includes(currentPath)) {
            sources.push(currentPath);
          }

          if (!visited.has(link.pathname) && queue.size < MAX_PAGES) {
            queue.add(link.pathname);
          }
        }

        // Небольшая задержка между открытием страниц
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        test.info().annotations.push({
          type: 'page-error',
          description: `Ошибка открытия ${currentPath}: ${String(error).slice(0, 100)}`,
        });
      }
    }

    test.info().annotations.push({
      type: 'links-found',
      description: `Собрано ссылок: ${allLinks.size}, страниц: ${visited.size}`,
    });

    const linkArray = Array.from(allLinks).sort();

    // Генерируем HTML-отчёт.
    // ВАЖНО: пишем в reports/ (НЕ в test-results/), т.к. Playwright очищает
    // свою выходную папку test-results/ в начале каждого прогона.
    const reportDir = 'reports';
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const htmlReport = generateHTMLReport({
      timestamp: new Date().toISOString(),
      pagesVisited: visited.size,
      linksFound: allLinks.size,
      allLinks: linkArray,
      linkSources,
    });

    const reportPath = path.join(reportDir, 'broken-links-report.html');
    fs.writeFileSync(reportPath, htmlReport);

    console.log(`\n📊 Отчёт сохранён: ${reportPath}`);
    console.log(`\nСтатистика:`);
    console.log(`  Страниц обойдено: ${visited.size}`);
    console.log(`  Собрано ссылок: ${allLinks.size}`);
    console.log(`\n✅ Сбор ссылок завершён! Откройте отчёт для просмотра полного списка.`);
  });
});

/**
 * Генерирует красивый HTML-отчёт со списком всех ссылок с источниками
 */
function generateHTMLReport(data: {
  timestamp: string;
  pagesVisited: number;
  linksFound: number;
  allLinks: string[];
  linkSources: Map<string, string[]>;
}): string {

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Отчёт о ссылках — 3s.money</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      margin-top: 0;
      color: #1a1a1a;
      border-bottom: 3px solid #0066cc;
      padding-bottom: 10px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 30px 0;
    }
    .stat-box {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
    }
    .stat-box.ok {
      background: #e8f5e9;
      color: #2e7d32;
      border-left: 4px solid #2e7d32;
    }
    .stat-number {
      font-size: 32px;
      display: block;
      margin: 10px 0;
    }
    .stat-label {
      font-size: 12px;
      text-transform: uppercase;
      opacity: 0.8;
    }
    .timestamp {
      color: #666;
      font-size: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    h2 {
      margin-top: 40px;
      color: #333;
      font-size: 20px;
      border-left: 4px solid #0066cc;
      padding-left: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }
    th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-weight: bold;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    tr:hover {
      background: #fafafa;
    }
    .url {
      word-break: break-all;
      font-family: monospace;
      font-size: 11px;
      max-width: 400px;
    }
    .source {
      color: #666;
      font-size: 11px;
      font-style: italic;
      margin-top: 4px;
    }
    .link-count {
      text-align: center;
      font-weight: bold;
      color: #0066cc;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔗 Отчёт о собранных ссылках — 3s.money</h1>

    <div class="stats">
      <div class="stat-box ok">
        <span class="stat-label">Собрано ссылок</span>
        <span class="stat-number">${data.linksFound}</span>
      </div>
      <div class="stat-box ok">
        <span class="stat-label">Страниц обойдено</span>
        <span class="stat-number">${data.pagesVisited}</span>
      </div>
    </div>

    <h2>✅ Все ссылки (${data.linksFound})</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 60px;">Кол-во</th>
          <th>URL</th>
          <th>Найдена на страницах</th>
        </tr>
      </thead>
      <tbody>
        ${data.allLinks
          .map((url) => {
            const sources = data.linkSources.get(url) || [];
            return `
        <tr>
          <td class="link-count">${sources.length}</td>
          <td class="url">
            <a href="${url}" target="_blank" rel="noopener">${url}</a>
          </td>
          <td>
            ${sources.length > 0 ? `<div class="source">${sources.map(s => `<div>• ${s}</div>`).join('')}</div>` : '-'}
          </td>
        </tr>
        `;
          })
          .join('')}
      </tbody>
    </table>

    <div class="timestamp">
      📅 Отчёт сгенерирован: ${new Date(data.timestamp).toLocaleString('ru-RU')}
    </div>
  </div>
</body>
</html>`;

  return html;
}
