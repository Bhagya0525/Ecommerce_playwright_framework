import { test, expect } from '@playwright/test';
import { StorePage } from '../../pages/StorePage';
import { products } from '../../test-data/products';

test('user can open a product from the store', async ({ page }) => {
  const storePage = new StorePage(page);

  await storePage.open();
  await storePage.openProduct(products.tshirt.title);

  await expect(page).toHaveURL(/products\/t-shirt/);
});