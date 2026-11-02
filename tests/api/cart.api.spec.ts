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