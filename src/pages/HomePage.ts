import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { MobileMenu } from '../components/MobileMenu';

export class HomePage extends BasePage {
  readonly mobileMenu: MobileMenu;
  /** Дропдаун счетов в демо-виджете клиентского портала. */
  readonly portalAccountsDropdown: Locator;
  readonly portalDropdownOptions: Locator;
  /** Кнопки главной для эвристики «мёртвых кнопок». */
  readonly contentButtons: Locator;

  constructor(page: Page) {
    super(page, '/');
    this.mobileMenu = new MobileMenu(page);
    this.portalAccountsDropdown = page.locator('[role="button"][aria-haspopup="listbox"]:visible').first();
    this.portalDropdownOptions = page.locator('[role="option"]:visible, [role="listbox"] li:visible');
    this.contentButtons = page.locator('main button:visible, [class*="Hero"] button:visible');
  }
}
