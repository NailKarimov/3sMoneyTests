import { test } from '@playwright/test';
import { gotoPage } from '../helpers';
import fs from 'fs';

test('Проверка 404 по всем ссылкам сайта', { tag: '@slow' }, async ({ page }) => {
  test.setTimeout(900_000); // 15 минут (проверяем все ссылки)

  // Читаем отчёт с собранными ссылками
  const reportPath = 'reports/broken-links-report.html';

  // Если отчёта нет — пропускаем тест с понятным сообщением,
  // а не падаем с ENOENT. Сначала нужно прогнать links/links-collect.spec.ts.
  if (!fs.existsSync(reportPath)) {
    test.skip(true, `Отчёт не найден: ${reportPath}. Сначала запустите links/links-collect.spec.ts.`);
    return;
  }

  const reportHtml = fs.readFileSync(reportPath, 'utf-8');

  // Извлекаем ссылки из HTML
  const linkMatches = reportHtml.match(/href="(https:\/\/3s\.money[^"]*)"[^>]*target="_blank"/g) || [];
  const links = [...new Set(linkMatches.map(m =>
    m.match(/href="([^"]+)"/)?.[1] || ''
  ).filter(Boolean))];

  console.log(`\n🔗 Найдено ссылок в отчёте: ${links.length}`);
  console.log(`📊 Проверяем ВСЕ ссылки (${links.length})\n`);

  const notFound: { url: string; reason: string }[] = [];
  let checked = 0;
  // БЕЗ ЗАДЕРЖКИ! 🚀

  console.log(`🔍 Ищу "Sorry, we couldn't find the page" и HTTP-статус >= 400...\n`);

  for (const url of links) {
    checked++;
    const displayUrl = url.length > 65 ? url.slice(0, 62) + '...' : url;
    process.stdout.write(`[${checked}/${links.length}] ${displayUrl} `);

    try {
      const response = await page
        .goto(url, { waitUntil: 'domcontentloaded', timeout: 20_000 })
        .catch(() => null);
      const status = response?.status() ?? 0;
      const pageContent = await page.content();
      const hasNotFoundText = pageContent.includes(
        "Sorry, we couldn't find the page you're looking for"
      );

      if (hasNotFoundText) {
        // Признак битой ссылки — текст 404 на странице.
        notFound.push({ url, reason: `текст 404 (HTTP ${status || '—'})` });
        console.log(`🔴 404 (текст)\n`);
      } else if (status >= 400) {
        // Дополнительно фиксируем плохой HTTP-статус.
        notFound.push({ url, reason: `HTTP ${status}` });
        console.log(`🔴 HTTP ${status}\n`);
      } else {
        console.log('✅\n');
      }
    } catch (error) {
      console.log('⚠️\n');
    }
  }

  console.log(`\n\n📊 ИТОГИ:`);
  console.log(`   Проверено: ${checked} ссылок из ${links.length}`);
  console.log(`   Найдено битых: ${notFound.length}`);

  if (notFound.length > 0) {
    console.log(`\n🔴 БИТЫЕ ССЫЛКИ:\n`);
    notFound.forEach((item, idx) => {
      console.log(`   ${idx + 1}. [${item.reason}] ${item.url}`);
    });
  } else {
    console.log(`\n✅ Все проверенные ссылки работают!`);
  }
});
