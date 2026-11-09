import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test('home page loads', { tag: '@smoke' }, async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.open();

  await expect(page).toHaveTitle(/Medusa/);
  await expect(homePage.heading).toBeVisible();
});