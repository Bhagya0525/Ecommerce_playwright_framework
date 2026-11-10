import { test, expect } from '../../fixtures';
import { products } from '../../test-data/products';

test('user can open a product from the store', async ({ page, storePage }) => {
  await storePage.open();
  await storePage.openProduct(products.tshirt.title);

  await expect(page).toHaveURL(/products\/t-shirt/);
});