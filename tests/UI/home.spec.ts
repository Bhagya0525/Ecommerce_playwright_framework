import { test, expect } from '../../fixtures';

test('home page loads', { tag: '@smoke' }, async ({ page, homePage }) => {
  await homePage.open();

  await expect(page).toHaveTitle(/Medusa/);
  await expect(homePage.heading).toBeVisible();
});