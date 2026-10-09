const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright');
const fs = require('fs');

async function gotoPage(page, path) {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' });
  await page.waitForLoadState('networkidle');
}

async function generateA11yReport() {
  const PAGES = ['/', '/contact-us', '/pricing'];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  const report = {};

  for (const path of PAGES) {
    console.log(`\n📋 Анализирую страницу: ${path}`);

    try {
      await gotoPage(page, path);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#CybotCookiebotDialog')
        .exclude('iframe')
        .analyze();

      const violations = results.violations;
      const byImpact = {
        critical: violations.filter(v => v.impact === 'critical'),
        serious: violations.filter(v => v.impact === 'serious'),
        moderate: violations.filter(v => v.impact === 'moderate'),
        minor: violations.filter(v => v.impact === 'minor'),
      };

      report[path] = {
        total: violations.length,
        summary: {
          critical: byImpact.critical.length,
          serious: byImpact.serious.length,
          moderate: byImpact.moderate.length,
          minor: byImpact.minor.length,
        },
        violations: Object.entries(byImpact).map(([impact, items]) => ({
          impact,
          count: items.length,
          issues: items.slice(0, 5).map(v => ({
            id: v.id,
            help: v.help,
            description: v.description,
            affectedNodes: v.nodes.length,
            firstExample: {
              html: v.nodes[0]?.html?.slice(0, 200),
              target: v.nodes[0]?.target?.[0],
            },
          })),
        })),
      };

      console.log(`  ✓ ${violations.length} violations найдено`);
      console.log(`    Critical: ${byImpact.critical.length}, Serious: ${byImpact.serious.length}`);
    } catch (err) {
      console.error(`  ❌ Ошибка при анализе ${path}:`, err.message);
    }
  }

  // Сохраню отчет
  fs.writeFileSync('a11y-report.json', JSON.stringify(report, null, 2));
  console.log('\n✅ Детальный отчет сохранен в a11y-report.json');

  // Выведу краткий summary
  console.log('\n📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('==================');
  for (const [path, data] of Object.entries(report)) {
    const summary = data.summary;
    console.log(`\n${path}:`);
    console.log(`  Total: ${data.total} нарушений`);
    console.log(`  🔴 Critical: ${summary.critical}`);
    console.log(`  🟠 Serious: ${summary.serious}`);
    console.log(`  🟡 Moderate: ${summary.moderate}`);
    console.log(`  ⚪ Minor: ${summary.minor}`);
  }

  await browser.close();
}

generateA11yReport().catch(console.error);
