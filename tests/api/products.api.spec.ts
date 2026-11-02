import { test, expect } from '@playwright/test';

const apiUrl = process.env.MEDUSA_API_URL;
const headers = { 'x-publishable-api-key': process.env.MEDUSA_PUBLISHABLE_KEY ?? '' };

test('store API returns the product list', { tag: '@smoke' }, async ({ request }) => {
  const response = await request.get(`${apiUrl}/store/products`, { headers });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.products.length).toBeGreaterThan(0);

  const titles = body.products.map((product: { title: string }) => product.title);
  expect(titles).toContain('Medusa T-Shirt');
});