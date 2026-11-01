import { test, expect } from '@playwright/test';
import { StorePage } from '../../pages/StorePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Cart', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    const storePage = new StorePage(page);
    productPage = new ProductPage(page);

    await storePage.open();
    await storePage.openProduct('Medusa T-Shirt');
    await productPage.selectSize('L');
    await productPage.selectColor('Black');
    await productPage.addToCart();
  });

  test('cart counter shows one item after adding a product', async () => {
    await expect(productPage.cartLink).toContainText('(1)');
  });

  test('cart page shows the selected product, variant and total', async ({ page }) => {
    const cartPage = new CartPage(page);

    await productPage.cartLink.click();
    await expect(page).toHaveURL(/\/cart/);

    await expect(cartPage.productTitle).toHaveText('Medusa T-Shirt');
    await expect(cartPage.productVariant).toContainText('L / Black');
    await expect(cartPage.cartTotal).toContainText('€10.00');
  });
});