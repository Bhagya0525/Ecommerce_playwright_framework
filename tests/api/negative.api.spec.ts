import { test, expect } from '../../fixtures';
import { products } from '../../test-data/products';

const apiUrl = process.env.MEDUSA_API_URL;
const validKey = process.env.MEDUSA_PUBLISHABLE_KEY ?? '';

// Each row becomes its own test, so the report shows exactly which case failed.
const invalidQuantities = [
  { name: 'a negative quantity', quantity: -1, errorType: 'invalid_data' },
  { name: 'a zero quantity', quantity: 0, errorType: 'invalid_data' },
  { name: 'more items than are in stock', quantity: 999999999, errorType: 'not_allowed' },
];

test.describe('The store API rejects bad requests', () => {
  test('a wrong publishable key is rejected', async ({ request }) => {
    const response = await request.get(`${apiUrl}/store/products`, {
      headers: { 'x-publishable-api-key': 'pk_wrong' },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).type).toBe('not_allowed');
  });

  test('an unknown product id returns not found', async ({ request }) => {
    const response = await request.get(`${apiUrl}/store/products/prod_does_not_exist`, {
      headers: { 'x-publishable-api-key': validKey },
    });

    expect(response.status()).toBe(404);
    expect((await response.json()).type).toBe('not_found');
  });

  for (const { name, quantity, errorType } of invalidQuantities) {
    test(`adding ${name} to a cart is rejected`, async ({ storeApi }) => {
      const variantId = await storeApi.getVariantId(products.tshirt.title);
      const cartId = await storeApi.createCart();

      const response = await storeApi.tryAddToCart(cartId, variantId, quantity);

      expect(response.status()).toBe(400);
      expect((await response.json()).type).toBe(errorType);
    });
  }

  test('a made-up variant id is rejected', async ({ storeApi }) => {
    const cartId = await storeApi.createCart();

    const response = await storeApi.tryAddToCart(cartId, 'not_a_variant', 1);

    expect(response.status()).toBe(400);
    expect((await response.json()).type).toBe('invalid_data');
  });

  test('the admin API refuses a request without a login', async ({ request }) => {
    const response = await request.get(`${apiUrl}/admin/products`, {
      headers: { 'x-publishable-api-key': validKey },
    });

    expect(response.status()).toBe(401);
  });
});