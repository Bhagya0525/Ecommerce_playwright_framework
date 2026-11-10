import { test, expect } from '../../fixtures';
import { products } from '../../test-data/products';

test('a product can be added to a new cart through the API', async ({ storeApi }) => {
  const variantId = await storeApi.getVariantId(products.tshirt.title);
  const cartId = await storeApi.createCart();
  const cart = await storeApi.addToCart(cartId, variantId, 2);

  expect(cart.items).toHaveLength(1);
  expect(cart.items[0].quantity).toBe(2);
  expect(cart.items[0].product_title).toBe(products.tshirt.title);
});

test('adding an item to a cart that does not exist is rejected', async ({ storeApi }) => {
  const variantId = await storeApi.getVariantId(products.tshirt.title);
  const response = await storeApi.tryAddToCart('cart_does_not_exist', variantId, 1);

  expect(response.status()).toBe(404);
});