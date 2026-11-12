import { test, expect } from '../../fixtures';
import { products } from '../../test-data/products';

// Asking for cartWithTshirt gives the test a cart that already holds one T-Shirt.

test('changing the quantity updates the cart total', async ({ cartWithTshirt, cartPage }) => {
  await cartPage.open();
  await expect(cartPage.cartTotal).toContainText(products.tshirt.price);

  await cartPage.setQuantity(2);

  await expect(cartPage.cartTotal).toContainText(products.tshirt.totalForTwo);
});

test('removing the only item empties the cart', async ({ cartWithTshirt, cartPage }) => {
  await cartPage.open();
  await expect(cartPage.productRows).toHaveCount(1);

  await cartPage.removeItem();

  await expect(cartPage.productRows).toHaveCount(0);
});