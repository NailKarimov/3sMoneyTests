# 3sMoneyTests

[![E2E audit](https://github.com/NailKarimov/3sMoneyTests/actions/workflows/e2e.yml/badge.svg)](https://github.com/NailKarimov/3sMoneyTests/actions/workflows/e2e.yml)
[![Allure report](https://img.shields.io/badge/report-Allure-orange)](https://nailkarimov.github.io/3sMoneyTests/)

An independent web quality audit of the public pages of [3s.money](https://3s.money), a UK business-payments
fintech, automated with **Playwright** and **TypeScript**. Every finding is written up as a bug report.

> This is a personal portfolio project. It is not affiliated with 3S Money. The tests only read public pages:
> no forms are submitted, no accounts are created, and requests are throttled.

| | |
| --- | --- |
| **System under test** | the public website 3s.money (third-party, production) |
| **Language and tools** | TypeScript · Playwright Test (headed Chrome) · axe-core · Allure |
| **Types of testing** | smoke, functional UI, responsive UI, accessibility (WCAG 2.2 AA), web performance, SEO, link integrity, privacy compliance (GDPR / UK PECR) |
| **Tests** | 64 in the fast suite + a full-site crawler (`@slow`, on demand) |
| **Test quality** | defects pinned with `knownBug()`; each test turns red when its bug is fixed, which is how BUG-003 was closed. No mutation check: this is someone else's production site |
| **Reports** | [Allure](https://nailkarimov.github.io/3sMoneyTests/) · [bug reports](docs/findings/) |

## What is tested

| Suite | Tool | What it proves |
| --- | --- | --- |
| `tests/smoke` | Playwright | the home page loads; the key heading and links are visible |
| `tests/functional` | Playwright | navigation of 8 key pages, menus, accordions, the language switcher (EN / FR / AR with RTL), contact form negative cases, 404 handling |
| `tests/ui` | Playwright | no horizontal scroll at 375 / 768 / 1440 px; the mobile menu; console errors; broken images; own 4xx / 5xx requests |
| `tests/a11y` | axe-core + keyboard | no critical or serious WCAG 2.2 A/AA violations (EN 301 549); Tab order without traps (2.1.2); visible focus (2.4.7); the focused element on screen (2.4.11) |
| `tests/performance` | Playwright | LCP and CLS below Google's "poor" thresholds; TTFB; total page weight |
| `tests/seo` | Playwright | title, meta description, canonical, `lang`, a single `<h1>`, Open Graph, robots.txt, sitemap |
| `tests/links` | Playwright | placeholder and empty `href`; `target=_blank` without `rel=noopener`; internal 404 / 5xx; a full-site crawler (`@slow`) |
| `tests/compliance` | Playwright | the consent banner is shown; no marketing trackers or tracking cookies before consent or after "Decline" (GDPR / UK PECR) |

## Findings

The audits found **10 defects**: 1 critical, 3 major, 4 minor and 2 trivial. One of them, BUG-003, is fixed:
on 23.10.2026 its test passed unexpectedly, which is the signal this design is built for. The full bug reports, with steps,
expected and actual results, are in [`docs/findings/`](docs/findings/).

| ID | Severity | Area | Summary |
| --- | --- | --- | --- |
| BUG-009 | critical | Privacy | analytics and marketing trackers load before consent and keep sending data after "Decline" |
| BUG-001 | major | Performance | the home page transfers ≈ 60 MB (≈ 28 MB on mobile) because videos autoload |
| BUG-002 | major | Accessibility | the mobile burger menu is a `div`, unreachable by keyboard and screen readers |
| BUG-010 | major | Accessibility | about half of the links and buttons show no visible focus indicator (WCAG 2.4.7) |
| BUG-003 | minor | Content | a link with an unrendered template placeholder in `href`; **fixed** by the site on 23.10.2026 |
| BUG-004 | minor | Accessibility | WCAG 2.2 AA violations: unnamed buttons and links, unlabeled fields, low contrast |
| BUG-005 | minor | SEO | three `<h1>` elements on the home page |
| BUG-006 | minor | Security | `target=_blank` links without `rel=noopener` |
| BUG-007 | trivial | UX / a11y | placeholder links `href="#"` used as buttons |
| BUG-008 | trivial | UX / SEO | the 404 page keeps the marketing `<title>` |

## Running it

Requirements: Node.js 22+, Google Chrome, Java 17+ for the Allure CLI.

```bash
npm ci
npm test               # fast suite, skips @slow tests
npm run test:smoke     # smoke only
npm run test:a11y      # accessibility only
npm run test:full      # everything, including the ~20 min crawler
npm run test:allure    # run tests and build the Allure report
npm run report         # open the Allure report
```

## Project structure

```text
src/config.ts            base URL, key pages, shared filters
src/support/             waiting for the Cloudflare check, keyboard helpers, knownBug()
src/components/          Header, CookieBanner, MobileMenu
src/pages/               BasePage, HomePage, ContactPage, HelpCentrePage, NotFoundPage
src/fixtures.ts          page objects injected into tests: async ({ homePage }) => ...
tests/                   specs grouped by quality area
docs/                    test plan, test report, bug reports, audit prompts
```

## Design decisions

- **Headed Chrome.** The site is behind Cloudflare, which blocks headless browsers. The tests run real Chrome
  with a window, locally and inside a virtual display (xvfb) in CI.
- **Gentle on production.** Two workers locally and one in CI; throttled crawling; sampled link checks; no runs on
  pull requests; no real form submissions.
- **Severity split in a11y.** Critical and serious violations fail the test; minor ones are attached to the
  report.
- **Rate limiting is not a site bug.** Cloudflare answers 429 to cloud runners more often than to home
  connections, so console errors caused by 429 are excluded from the console-errors check.

## CI

`.github/workflows/e2e.yml` runs on push to `main`, every Monday at 06:00 UTC, and on demand with the fast, smoke
or full suite. It type-checks the project, runs the tests in headed Chrome under xvfb, keeps the Allure history
and publishes the report to GitHub Pages.

## Documentation

| Document | What it is |
| --- | --- |
| [`docs/test-plan.md`](docs/test-plan.md) | test plan (ISO/IEC/IEEE 29119-3) |
| [`docs/test-report.md`](docs/test-report.md) | test summary report: latest results, defects, recommendations |
| [`docs/findings/`](docs/findings/) | bug reports of each audit run (in Russian) |
| [`docs/master-audit-prompt.md`](docs/master-audit-prompt.md), [`docs/prompts/`](docs/prompts/) | prompts for AI-assisted exploratory audits of a page (in Russian) |

## Part of a portfolio

One of 13 test automation projects by [Nail Karimov](https://github.com/NailKarimov):
[all projects](https://github.com/NailKarimov) ·
[testing map](https://nailkarimov.github.io/api-test-automation/testing-map.html) ·
[toolbox](https://nailkarimov.github.io/api-test-automation/toolbox.html).
