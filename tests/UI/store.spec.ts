import { test, expect } from '@playwright/test';
import { StorePage } from '../../pages/StorePage';

test('user can open a product from the store', async ({ page }) => {
  const storePage = new StorePage(page);

  await storePage.open();
  await storePage.openProduct('Medusa T-Shirt');

  await expect(page).toHaveURL(/products\/t-shirt/);
});