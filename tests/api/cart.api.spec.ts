import { test, expect } from '@playwright/test';
import { StoreApi } from '../../api/StoreApi';

test('a product can be added to a new cart through the API', async ({ request }) => {
  const storeApi = new StoreApi(request);

  const variantId = await storeApi.getVariantId('Medusa T-Shirt');
  const cartId = await storeApi.createCart();
  const cart = await storeApi.addToCart(cartId, variantId, 2);

  expect(cart.items).toHaveLength(1);
  expect(cart.items[0].quantity).toBe(2);
  expect(cart.items[0].product_title).toBe('Medusa T-Shirt');
});
test('adding an item to a cart that does not exist is rejected', async ({ request }) => {
  const storeApi = new StoreApi(request);

  const variantId = await storeApi.getVariantId('Medusa T-Shirt');
  const response = await storeApi.tryAddToCart('cart_does_not_exist', variantId, 1);

  expect(response.status()).toBe(404);
});