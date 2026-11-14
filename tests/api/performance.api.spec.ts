import { test, expect } from '../../fixtures';

const API_BUDGET_MS = 2000;

const median = (values: number[]) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

test('listing products answers within the time budget', { tag: '@perf' }, async ({ storeApi }) => {

  await storeApi.listProducts();

  const times: number[] = [];
  for (let i = 0; i < 3; i++) {
    const start = Date.now();
    const response = await storeApi.listProducts();
    times.push(Date.now() - start);
    expect(response.status()).toBe(200);
  }

  expect(median(times), `response times in ms: ${times.join(', ')}`).toBeLessThan(API_BUDGET_MS);
});