import { test, expect } from '@playwright/test';
import { StorePage } from '../../pages/StorePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { products } from '../../test-data/products';

test.describe('Cart', () => {
  let productPage: ProductPage;
  const { tshirt } = products;

  test.beforeEach(async ({ page }) => {
    const storePage = new StorePage(page);
    productPage = new ProductPage(page);

    await storePage.open();
    await storePage.openProduct(tshirt.title);
    await productPage.selectSize(tshirt.size);
    await productPage.selectColor(tshirt.color);
    await productPage.addToCart();
  });

  test('cart counter shows one item after adding a product', { tag: '@smoke' }, async () => {
    await expect(productPage.cartLink).toContainText('(1)');
  });

  test('cart page shows the selected product, variant and total', async ({ page }) => {
    const cartPage = new CartPage(page);

    await productPage.cartLink.click();
    await expect(page).toHaveURL(/\/cart/);

    await expect(cartPage.productTitle).toHaveText(tshirt.title);
    await expect(cartPage.productVariant).toContainText(`${tshirt.size} / ${tshirt.color}`);
    await expect(cartPage.cartTotal).toContainText(tshirt.price);
  });
});