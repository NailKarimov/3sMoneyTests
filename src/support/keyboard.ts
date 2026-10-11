import { Page } from '@playwright/test';

/** Snapshot of the element that holds keyboard focus after one Tab press. */
export type TabStop = {
  index: number;
  /** Short readable description: tag, accessible text and href. */
  label: string;
  /** Identity of the focused DOM element (stable within one page load). */
  key: string;
  /** True when focus is on <body> (nothing focusable was reached). */
  onBody: boolean;
  /** True when focus visibly changes the element's style (outline, shadow, border, colours, underline). */
  hasFocusIndicator: boolean;
  /** True when at least part of the element is inside the viewport. */
  inViewport: boolean;
};

/**
 * Presses Tab `count` times from the top of the page and records every focus stop.
 * Before tabbing, the unfocused style of every focusable element is remembered, so a
 * focus indicator counts as present when ANY visible style changes on focus — not only
 * the browser's default outline.
 */
export async function collectTabStops(page: Page, count: number): Promise<TabStop[]> {
  await page.evaluate(() => {
    const w = window as unknown as { __ks: Record<string, string>; __ksSig: (el: Element) => string };
    // Style signature of the element and its ::before/::after (indicators are often drawn there).
    w.__ksSig = (el: Element) =>
      [null, '::before', '::after']
        .map((pseudo) => {
          const s = getComputedStyle(el, pseudo);
          return [
            s.outlineStyle,
            s.outlineWidth,
            s.outlineColor,
            s.boxShadow,
            s.borderTopColor,
            s.borderBottomColor,
            s.borderBottomWidth,
            s.backgroundColor,
            s.color,
            s.textDecorationLine,
            s.opacity,
            s.transform,
          ].join('|');
        })
        .join('||');
    (document.activeElement as HTMLElement | null)?.blur();
    window.scrollTo(0, 0);
    w.__ks = {};
    const focusable = document.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])',
    );
    focusable.forEach((el, i) => {
      el.dataset.ksId = String(i);
      w.__ks[String(i)] = w.__ksSig(el);
    });
  });

  const stops: TabStop[] = [];
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate((index) => {
      const w = window as unknown as { __ks: Record<string, string>; __ksSig: (el: Element) => string };
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body || el === document.documentElement) {
        return { index, label: '<body>', key: 'body', onBody: true, hasFocusIndicator: false, inViewport: false };
      }
      const id = el.dataset.ksId ?? `new-${index}`;
      const before = w.__ks[id];
      // An element we did not see before (rendered later) is compared with its blurred-out default.
      const hasFocusIndicator = before === undefined ? true : before !== w.__ksSig(el);
      const r = el.getBoundingClientRect();
      const inViewport = r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;
      const text = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      const href = (el.getAttribute('href') || '').split('?')[0];
      return {
        index,
        label: `<${el.tagName.toLowerCase()}> "${text}"${href ? ` ${href}` : ''}`,
        key: id,
        onBody: false,
        hasFocusIndicator,
        inViewport,
      };
    }, i + 1);
    stops.push(stop);
  }
  return stops;
}
