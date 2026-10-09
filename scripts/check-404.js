const fs = require('fs');
const https = require('https');

const reportPath = 'reports/broken-links-report.html';
const html = fs.readFileSync(reportPath, 'utf-8');

// Извлекаем все ссылки из HTML отчёта
const linkMatches = html.match(/href="(https:\/\/3s\.money[^"]+)"/g) || [];
const links = [...new Set(linkMatches.map(m => m.replace('href="', '').replace('"', '')))];

console.log(`\n🔍 Найдено ${links.length} уникальных ссылок\n`);
console.log(`⏱️  Проверяю первые 30 ссылок (с задержкой 8 сек между проверками)...\n`);

const notFound = [];
let checked = 0;

async function checkLink(url) {
  return new Promise((resolve) => {
    const request = https.get(url, { timeout: 15000 }, (res) => {
      resolve(res.statusCode);
      res.resume(); // Consume response
    });

    request.on('error', () => {
      resolve(0); // Network error
    });

    request.on('timeout', () => {
      request.destroy();
      resolve(0);
    });
  });
}

async function checkLinks() {
  for (let i = 0; i < Math.min(30, links.length); i++) {
    const url = links[i];
    checked++;

    try {
      const status = await checkLink(url);
      console.log(`[${checked}/30] ${url.slice(0, 60)}`);

      if (status === 404) {
        notFound.push(url);
        console.log(`       🔴 404 ОШИБКА!\n`);
      } else if (status === 403 || status === 429) {
        console.log(`       ⏸️  Cloudflare (${status}) - остановка\n`);
        break;
      } else if (status >= 400) {
        console.log(`       ⚠️  Ошибка ${status}\n`);
      } else {
        console.log(`       ✅ OK (${status})\n`);
      }
    } catch (error) {
      console.log(`       ❌ Ошибка\n`);
    }

    // Задержка 8 сек
    if (i < 29) await new Promise(r => setTimeout(r, 8000));
  }

  console.log(`\n📊 РЕЗУЛЬТАТЫ:`);
  console.log(`   Проверено: ${checked}`);
  console.log(`   Найдено 404: ${notFound.length}`);

  if (notFound.length > 0) {
    console.log(`\n🔴 Ссылки с 404 ошибками:`);
    notFound.forEach(url => console.log(`   • ${url}`));
  } else {
    console.log(`\n✅ Все проверенные ссылки работают!`);
  }
}

checkLinks();
