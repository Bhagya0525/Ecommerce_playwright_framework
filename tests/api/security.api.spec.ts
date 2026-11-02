import { test, expect } from '@playwright/test';

test('store API rejects a request without a publishable key', async ({ request }) => {
  const response = await request.get(`${process.env.MEDUSA_API_URL}/store/products`);

  expect(response.status()).toBe(400);
});