import { test, expect } from '../../fixtures';
import { products } from '../../test-data/products';

test.describe('Cart', () => {
  const { tshirt } = products;

  test.beforeEach(async ({ storePage, productPage }) => {
    await storePage.open();
    await storePage.openProduct(tshirt.title);
    await productPage.selectSize(tshirt.size);
    await productPage.selectColor(tshirt.color);
    await productPage.addToCart();
  });

  test('cart counter shows one item after adding a product', { tag: '@smoke' }, async ({ productPage }) => {
    await expect(productPage.cartLink).toContainText('(1)');
  });

  test('cart page shows the selected product, variant and total', async ({ page, productPage, cartPage }) => {
    await productPage.cartLink.click();
    await expect(page).toHaveURL(/\/cart/);

    await expect(cartPage.productTitle).toHaveText(tshirt.title);
    await expect(cartPage.productVariant).toContainText(`${tshirt.size} / ${tshirt.color}`);
    await expect(cartPage.cartTotal).toContainText(tshirt.price);
  });
});