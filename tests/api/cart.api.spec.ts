import { test, expect } from '@playwright/test';

const apiUrl = process.env.MEDUSA_API_URL;
const headers = { 'x-publishable-api-key': process.env.MEDUSA_PUBLISHABLE_KEY ?? '' };

test('a product can be added to a new cart through the API', async ({ request }) => {
  // 1. Get a region and the T-Shirt's variant id
  const regionsResponse = await request.get(`${apiUrl}/store/regions`, { headers });
  const { regions } = await regionsResponse.json();

  const productsResponse = await request.get(`${apiUrl}/store/products?fields=*variants`, { headers });
  const { products } = await productsResponse.json();
  const tshirt = products.find((product: { title: string }) => product.title === 'Medusa T-Shirt');
  const variantId = tshirt.variants[0].id;

  // 2. Create an empty cart
  const cartResponse = await request.post(`${apiUrl}/store/carts`, {
    headers,
    data: { region_id: regions[0].id },
  });
  expect(cartResponse.status()).toBe(200);
  const { cart } = await cartResponse.json();

  // 3. Add two T-Shirts to the cart
  const addResponse = await request.post(`${apiUrl}/store/carts/${cart.id}/line-items`, {
    headers,
    data: { variant_id: variantId, quantity: 2 },
  });
  expect(addResponse.status()).toBe(200);
  const { cart: updatedCart } = await addResponse.json();

  // 4. Check the result
  expect(updatedCart.items).toHaveLength(1);
  expect(updatedCart.items[0].quantity).toBe(2);
  expect(updatedCart.items[0].product_title).toBe('Medusa T-Shirt');
});