import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { gotoPage } from './tests/helpers.js';
import * as fs from 'fs';

const PAGES = ['/', '/contact-us', '/pricing'];
const BASE_URL = 'https://3s.money';

async function generateA11yReport() {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });

  const page = await browser.newPage({
    baseURL: BASE_URL,
  });

  const report: Record<string, unknown> = {};

  for (const path of PAGES) {
    console.log(`\n📋 Анализирую страницу: ${path}`);

    try {
      await gotoPage(page, path);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#CybotCookiebotDialog')
        .exclude('iframe')
        .analyze();

      const violations = results.violations;
      const byImpact = {
        critical: violations.filter((v: any) => v.impact === 'critical'),
        serious: violations.filter((v: any) => v.impact === 'serious'),
        moderate: violations.filter((v: any) => v.impact === 'moderate'),
        minor: violations.filter((v: any) => v.impact === 'minor'),
      };

      report[path] = {
        total: violations.length,
        summary: {
          critical: byImpact.critical.length,
          serious: byImpact.serious.length,
          moderate: byImpact.moderate.length,
          minor: byImpact.minor.length,
        },
        violations: Object.entries(byImpact).map(([impact, items]: [string, any]) => ({
          impact,
          count: items.length,
          issues: items.slice(0, 5).map((v: any) => ({
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
      console.log(
        `    Critical: ${byImpact.critical.length}, Serious: ${byImpact.serious.length}`
      );
    } catch (err) {
      console.error(`  ❌ Ошибка при анализе ${path}:`, (err as Error).message);
    }
  }

  // Сохраню отчет
  fs.writeFileSync('a11y-report.json', JSON.stringify(report, null, 2));
  console.log('\n✅ Детальный отчет сохранен в a11y-report.json');

  // Выведу краткий summary
  console.log('\n📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('==================');
  for (const [path, data] of Object.entries(report)) {
    const d = data as Record<string, any>;
    const summary = d.summary;
    console.log(`\n${path}:`);
    console.log(`  Total: ${d.total} нарушений`);
    console.log(`  🔴 Critical: ${summary.critical}`);
    console.log(`  🟠 Serious: ${summary.serious}`);
    console.log(`  🟡 Moderate: ${summary.moderate}`);
    console.log(`  ⚪ Minor: ${summary.minor}`);
  }

  await browser.close();
}

generateA11yReport().catch(console.error);
