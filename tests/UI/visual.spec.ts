import { test, expect } from '../../fixtures';

test('the empty cart page looks as expected', { tag: '@visual' }, async ({ page, cartPage, browserName }) => {
  test.skip(browserName !== 'chromium', 'Visual checks run once, on Chromium.');

  await cartPage.open();
  await expect(page.getByRole('heading', { name: 'Cart' })).toBeVisible();

  await expect(page).toHaveScreenshot('empty-cart.png', {
    animations: 'disabled',
    mask: [page.getByRole('button', { name: 'Open Next.js Dev Tools' })],
    maxDiffPixelRatio: 0.01,
  });
});