import { test, expect } from '../../fixtures';
import { productListSchema } from '../../api/schemas';

test('product list response matches the agreed shape', async ({ storeApi }) => {
  const response = await storeApi.listProducts();
  expect(response.status()).toBe(200);

  const result = productListSchema.safeParse(await response.json());

  // If the shape is wrong, the failure message lists exactly which fields are wrong.
  expect(result.success, JSON.stringify(result.error?.issues, null, 2)).toBe(true);
});