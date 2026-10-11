import { test as base, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ContactPage } from './pages/ContactPage';
import { HelpCentrePage } from './pages/HelpCentrePage';
import { NotFoundPage } from './pages/NotFoundPage';

type Pages = {
  homePage: HomePage;
  contactPage: ContactPage;
  helpCentrePage: HelpCentrePage;
  notFoundPage: NotFoundPage;
};

/**
 * Тест с page objects в фикстурах: `test('...', async ({ homePage }) => { ... })`.
 * Объекты создаются лениво — только если тест их запросил.
 */
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  helpCentrePage: async ({ page }, use) => use(new HelpCentrePage(page)),
  notFoundPage: async ({ page }, use) => use(new NotFoundPage(page)),
});

export { expect };
