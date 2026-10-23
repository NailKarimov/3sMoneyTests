# Test plan: 3s.money public website (3sMoneyTests)

The structure follows ISO/IEC/IEEE 29119-3 (test plan), shortened for one project.

## 1. Context

- **System under test:** the public pages of https://3s.money, the production website of a UK business-payments
  company. It is third-party, behind Cloudflare, and is tested from outside only.
- **Goal:** an independent quality audit of what any visitor sees. It covers function, layout, accessibility,
  speed, SEO, links and privacy, with every finding written up as a bug report.
- **References:**
  - WCAG 2.2 A/AA and EN 301 549 V4.1.1;
  - Core Web Vitals;
  - UK GDPR and PECR (consent for non-essential cookies and trackers);
  - ISTQB test design techniques.

## 2. Scope

| In scope | Out of scope |
| --- | --- |
| public pages: home, key product pages, help centre, contact, 404 | the logged-in banking app |
| desktop and mobile layouts (375 / 768 / 1440 px) | submitting forms or creating accounts |
| keyboard and automated accessibility checks | a full manual screen-reader audit |
| consent banner and trackers before and after consent | the content of third-party trackers |

## 3. Quality characteristics (ISO/IEC 25010)

| Characteristic | Covered by |
| --- | --- |
| Functional correctness | smoke and functional UI tests |
| Usability (accessibility, responsiveness) | axe-core, keyboard tests, layout at three widths |
| Performance efficiency | LCP, CLS, TTFB, page weight |
| Security | `rel=noopener` on external links |
| Compliance (privacy) | no trackers or tracking cookies before consent or after "Decline" |

## 4. Approach

- **Levels:** black-box UI tests in headed Chrome against production.
- **Techniques:**
  - equivalence classes for viewports and languages;
  - negative cases for the contact form, without submitting it;
  - sampling for links, with a full crawler on demand.
- **Defects:** each one becomes a bug report in `docs/findings/` and a test marked `knownBug('BUG-xxx')`.
- **Ethics:** read-only, throttled, one worker in CI, and no runs on pull requests.

## 5. Risks

| Risk | Mitigation |
| --- | --- |
| Cloudflare blocks headless or cloud traffic | headed Chrome under xvfb; waiting for the check; one retry |
| The site changes without notice | page objects keep selectors in one place; weekly runs |
| Load on a production site | throttling, sampling, one worker |

## 6. Entry and exit criteria

- **Entry:** the site is reachable and the type check passes.
- **Exit:** every test passes or is a known bug with a report; no new critical or serious accessibility violation.

## 7. Deliverables

The test suite, the Allure report on GitHub Pages, the bug reports and [`test-report.md`](test-report.md).
