# 3s-money-tests

[![E2E audit](https://github.com/YOUR_GITHUB_USERNAME/3s-money-tests/actions/workflows/e2e.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/3s-money-tests/actions/workflows/e2e.yml)
[![Allure report](https://img.shields.io/badge/report-Allure-orange)](https://YOUR_GITHUB_USERNAME.github.io/3s-money-tests/)

Independent web quality audit of the public pages of [3s.money](https://3s.money), a UK business-payments
fintech. Automated with **Playwright + TypeScript**, reported with **Allure**, run in **GitHub Actions**.

The suite covers eight quality areas — smoke, functional UI, responsive UI, accessibility, performance,
SEO, link integrity and privacy compliance — and every finding is documented as a bug report.

> This is a personal portfolio project. It is not affiliated with 3S Money. Tests only read public pages:
> no forms are submitted, no accounts are created, and requests are throttled.

## What is tested

| Area | Standard / reference | Specs | What it checks |
| --- | --- | --- | --- |
| Smoke | — | `tests/smoke` | Home page loads, key heading and links are visible |
| Functional UI | ISTQB test design techniques | `tests/functional` | Navigation of 8 key pages, menus, accordions, language switcher (EN/FR/AR + RTL), contact form negative cases, 404 handling |
| Responsive UI | — | `tests/ui` | No horizontal scroll at 375 / 768 / 1440 px, mobile menu, console errors, broken images, own 4xx/5xx requests |
| Accessibility | WCAG 2.1 A/AA via axe-core | `tests/a11y` | No critical/serious violations; minor ones are attached to the report |
| Performance | Core Web Vitals | `tests/performance` | LCP and CLS below Google's "poor" thresholds, TTFB, total page weight |
| SEO | — | `tests/seo` | Title, meta description, canonical, `lang`, single `<h1>`, Open Graph, robots.txt, sitemap |
| Links | — | `tests/links` | Placeholder and empty `href`, `target=_blank` without `rel=noopener`, internal 404/5xx; full-site crawler (`@slow`) |
| Privacy compliance | GDPR / UK PECR | `tests/compliance` | Consent banner shown; no marketing trackers or tracking cookies before consent or after "Decline" |

## Findings

The baseline audit (20 Sep 2026) found **9 defects**: 1 critical, 2 major, 4 minor, 2 trivial.
Full bug reports with steps, expected and actual results: [`docs/findings/`](docs/findings/).

| ID | Severity | Area | Summary |
| --- | --- | --- | --- |
| BUG-009 | critical | Privacy | Analytics and marketing trackers load before consent and keep sending data after "Decline" |
| BUG-001 | major | Performance | Home page transfers ≈60 MB (≈28 MB on mobile) because videos autoload |
| BUG-002 | major | Accessibility | Mobile burger menu is a `div`, unreachable by keyboard and screen readers |
| BUG-003 | minor | Content | Link with an unrendered template placeholder in `href` |
| BUG-004 | minor | Accessibility | WCAG 2.1 AA violations: unnamed buttons and links, unlabeled form fields, low contrast |
| BUG-005 | minor | SEO | Three `<h1>` elements on the home page |
| BUG-006 | minor | Security | `target=_blank` links without `rel=noopener` |
| BUG-007 | trivial | UX / a11y | Placeholder links `href="#"` used as buttons |
| BUG-008 | trivial | UX / SEO | 404 page keeps the marketing `<title>` |

Tests that catch a known defect are marked with `knownBug('BUG-xxx')` (Playwright `test.fail`): the build stays
green while the bug exists and the bug ID is shown in the report. When the site fixes the bug, the test reports
an unexpected pass — the signal to remove the marker and close the bug.

## Project structure

```
src/
  config.ts            base URL, key pages, shared filters
  support/cloudflare.ts  waiting for the Cloudflare check
  components/          Header, CookieBanner, MobileMenu
  pages/               BasePage, HomePage, ContactPage, HelpCentrePage, NotFoundPage
  fixtures.ts          page objects injected into tests: async ({ homePage }) => ...
tests/                 specs grouped by quality area
docs/findings/         bug reports from audit runs
.github/workflows/     CI: run, build Allure, publish to GitHub Pages
```

Tests contain only actions and assertions. Selectors and page behaviour live in page objects,
so a layout change on the site is fixed in one place.

## Running locally

Requirements: Node.js 22+, Google Chrome, Java 17+ (for the Allure CLI).

```bash
npm ci
npm test               # fast suite, skips @slow tests
npm run test:smoke     # smoke only
npm run test:a11y      # accessibility only
npm run test:full      # everything, including the ~20 min crawler
npm run test:allure    # run tests and build the Allure report
npm run report         # open the Allure report
```

## Design decisions

- **Headed Chrome.** The site is behind Cloudflare, which blocks headless browsers. Tests run real Chrome
  with a window locally and inside a virtual display (xvfb) in CI.
- **Gentle on production.** Two workers, throttled crawling, sampled link checks, no PR-triggered runs,
  and no real form submissions.
- **Fast and slow suites.** The crawler and full link scan are tagged `@slow` and run only on demand.
- **Severity split in a11y.** Critical and serious violations fail the test; minor ones are attached
  to the Allure report as annotations.
- **One retry.** Network-level flakiness from Cloudflare is retried once; retries are visible in Allure.

## CI

`.github/workflows/e2e.yml` runs on push to `main`, every Monday and on demand (fast, smoke or full suite).
It type-checks the project, runs the tests, keeps Allure history between runs and publishes the report
to GitHub Pages.

## Tech stack

Playwright Test · TypeScript · axe-core · Allure Report · GitHub Actions
