import { test, expect } from '../../fixtures';
import { products } from '../../test-data/products';

test.describe('Search under bad network conditions', () => {
  test('results still appear when the search API is slow', async ({ page, storePage, browserName }) => {
    test.skip(browserName !== 'chromium', 'Network simulations run once, on Chromium.');
    test.slow();

   
    await page.route('**/store/search**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await route.continue();
    });

    await storePage.open();
    await storePage.search('shirt');

  
    await expect(storePage.searchInput).toHaveValue('shirt');
    
    await expect(storePage.productLink(products.tshirt.title)).toBeVisible({ timeout: 20000 });
  });

  test('the shopper still sees products when the search API fails', async ({ page, storePage, browserName }) => {
    test.skip(browserName !== 'chromium', 'Network simulations run once, on Chromium.');
    // Known issue in the starter store: a failing search throws a runtime error and the
    // product list disappears. This test is expected to fail until the store handles it.
    test.fail(true, 'Known issue: a failing search crashes the product list');

    await page.route('**/store/search**', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'boom' }),
      }),
    );

    await storePage.open();
    await storePage.search('shirt');

    await expect(storePage.productLink(products.tshirt.title)).toBeVisible();
  });
});