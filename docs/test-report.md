# Test summary report: 3s.money public website (3sMoneyTests)

The structure follows ISO/IEC/IEEE 29119-3 (test completion report), shortened.

- **Period:** 20.09.2026 – 19.10.2026
- **Build:** the production website at the time of each run
- **Allure report:** https://nailkarimov.github.io/3sMoneyTests/

## 1. Summary

The site works and is navigable. Its main risks are privacy and accessibility. Trackers run before consent and
after "Decline" (critical). The mobile menu cannot be reached by keyboard or screen reader, and about half the
controls have no visible focus. The home page is very heavy: ≈ 60 MB on desktop.

## 2. Results

| Metric | Value |
| --- | --- |
| Tests in the latest run (fast suite) | 64 |
| Passed / failed / skipped | 64 / 0 / 0 (known bugs pinned with `knownBug()`) |
| Duration | ~5 min (one worker, headed Chrome) |
| Defects found | 10: 1 critical, 3 major, 4 minor, 2 trivial |

## 3. Defects

| ID | Severity | Summary | Status |
| --- | --- | --- | --- |
| BUG-009 | critical | trackers before consent and after "Decline" | open |
| BUG-001 | major | ≈ 60 MB home page (autoloading videos) | open |
| BUG-002 | major | the mobile menu is not keyboard or screen-reader accessible | open |
| BUG-010 | major | no visible focus on about half of the controls | open |
| BUG-003…008 | minor and trivial | placeholder link, WCAG violations, three `<h1>`, `noopener`, `href="#"`, the 404 title | open |

Full reports: [`findings/`](findings/).

## 4. Deviations from the plan

- The full crawler runs on demand only, to keep the load on production low.

## 5. Recommendations

1. Block all non-essential trackers until consent, and honour "Decline" (BUG-009). This is a legal risk.
2. Make the mobile menu a `<button>` with `aria-expanded`, and restore visible focus styles (BUG-002, BUG-010).
3. Do not autoload the videos: use `preload="none"` and a poster image (BUG-001).
