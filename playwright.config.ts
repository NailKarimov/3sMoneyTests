import { defineConfig } from '@playwright/test';

// Тяжёлые тесты (@slow: краулер и полная проверка ссылок, ~20 мин) по умолчанию
// пропускаем. Включаются через `npm run test:full` / `npm run test:slow`
// (npm кладёт имя скрипта в npm_lifecycle_event — работает и в cmd на Windows)
// или переменной окружения RUN_SLOW=1.
const runSlow =
  ['test:full', 'test:slow'].includes(process.env.npm_lifecycle_event ?? '') ||
  process.env.RUN_SLOW === '1';

export default defineConfig({
  testDir: './tests',
  grepInvert: runSlow ? undefined : /@slow/,
  timeout: 90_000,
  // В CI запрещаем случайно оставленный test.only.
  forbidOnly: !!process.env.CI,
  expect: { timeout: 15_000 },
  // Ограничиваем параллельность и добавляем ретрай: сайт за Cloudflare,
  // много одновременных окон/запросов провоцируют блокировку.
  workers: 2,
  retries: 1,
  use: {
    baseURL: 'https://3s.money',
    // Сайт защищён Cloudflare: headless-браузер не проходит проверку,
    // поэтому используем реальный Chrome в headed-режиме.
    channel: 'chrome',
    headless: false,
    screenshot: 'only-on-failure',
    // Trace-архивы весят десятки мегабайт; в CI их не пишем, чтобы отчёт на GitHub Pages оставался лёгким.
    trace: process.env.CI ? 'off' : 'retain-on-failure',
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright'],
  ],
});
