import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Help centre: аккордеоны с вопросами. Состояние кодируется классом AccordionPanel_activeAccordion. */
export class HelpCentrePage extends BasePage {
  readonly accordionTitles: Locator;
  readonly accordionPanels: Locator;

  constructor(page: Page) {
    super(page, '/help-centre');
    this.accordionTitles = page.locator('[class*="AccordionPanel_title"]');
    this.accordionPanels = page.locator('[class*="AccordionPanel_accordionPanel"]');
  }

  async isAccordionActive(index: number): Promise<boolean> {
    const cls = (await this.accordionPanels.nth(index).getAttribute('class')) || '';
    return /activeAccordion/.test(cls);
  }

  async toggleAccordion(index: number): Promise<void> {
    const title = this.accordionTitles.nth(index);
    await title.scrollIntoViewIfNeeded();
    await title.click();
    await this.page.waitForTimeout(1_000);
  }

  async accordionText(index: number): Promise<string> {
    const content = this.accordionPanels.nth(index).locator('[class*="AccordionPanel_content"]').first();
    return ((await content.textContent()) || '').trim();
  }
}
