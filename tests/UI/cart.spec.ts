import { test, expect } from '@playwright/test';
import { StorePage } from '../../pages/StorePage';
import { ProductPage } from '../../pages/ProductPage';

test('user can add a product to the cart', async ({ page }) => {
  const storePage = new StorePage(page);
  const productPage = new ProductPage(page);

  await storePage.open();
  await storePage.openProduct('Medusa T-Shirt');
  await productPage.selectSize('L');
  await productPage.selectColor('Black');
  await productPage.addToCart();

  await expect(productPage.cartLink).toContainText('(1)');
});