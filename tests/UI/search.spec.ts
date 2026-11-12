import { test, expect } from '../../fixtures';
import { products } from '../../test-data/products';

test('searching for "shirt" keeps the T-Shirt and hides unrelated products', async ({ storePage }) => {
  await storePage.open();

  await storePage.search('shirt');

  // The Shorts link disappears once the results are filtered
  await expect(storePage.productLink(products.shorts.title)).toBeHidden();
  await expect(storePage.productLink(products.tshirt.title)).toBeVisible();
});