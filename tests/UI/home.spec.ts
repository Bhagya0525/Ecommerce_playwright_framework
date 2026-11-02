import { test, expect } from '@playwright/test';

test('home page loads', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Medusa/);
  await expect(page.getByText('Ecommerce Starter Template')).toBeVisible();
});