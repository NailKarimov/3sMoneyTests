import { Page } from '@playwright/test';

/** Snapshot of the element that holds keyboard focus after one Tab press. */
export type TabStop = {
  index: number;
  /** Short readable description: tag, accessible text and href. */
  label: string;
  /** Stable key to compare stops (outerHTML prefix). */
  key: string;
  /** True when focus left the page document (e.g. moved to the browser UI). */
  onBody: boolean;
  /** True when the element has a visible focus indicator (outline or box-shadow). */
  hasFocusIndicator: boolean;
  /** True when at least part of the element is inside the viewport. */
  inViewport: boolean;
};

/** Presses Tab `count` times from the top of the page and records every focus stop. */
export async function collectTabStops(page: Page, count: number): Promise<TabStop[]> {
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur();
    window.scrollTo(0, 0);
  });
  const stops: TabStop[] = [];
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate((index) => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body || el === document.documentElement) {
        return { index, label: '<body>', key: 'body', onBody: true, hasFocusIndicator: false, inViewport: false };
      }
      const style = getComputedStyle(el);
      const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
      const shadow = style.boxShadow !== 'none' && style.boxShadow !== '';
      const r = el.getBoundingClientRect();
      const inViewport = r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;
      const text = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      const href = el.getAttribute('href');
      return {
        index,
        label: `<${el.tagName.toLowerCase()}> "${text}"${href ? ` ${href}` : ''}`,
        key: el.outerHTML.slice(0, 200),
        onBody: false,
        hasFocusIndicator: outline || shadow,
        inViewport,
      };
    }, i + 1);
    stops.push(stop);
  }
  return stops;
}
