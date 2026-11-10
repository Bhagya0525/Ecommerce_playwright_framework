import { test, expect } from '../../fixtures';
import { products } from '../../test-data/products';

test('a cart created through the API appears in the storefront', async ({ storeApi, cartPage, context, page }) => {
  // Build the cart through the API
  const variantId = await storeApi.getVariantId(products.tshirt.title);
  const cartId = await storeApi.createCart();
  await storeApi.addToCart(cartId, variantId, 2);

  // Tell the browser "this is my cart"
  await context.addCookies([
    { name: '_medusa_cart_id', value: cartId, domain: 'localhost', path: '/' },
  ]);

  // Open the cart page and check what the shopper sees
  await page.goto('/dk/cart');
  await expect(cartPage.productTitle).toHaveText(products.tshirt.title);
  await expect(cartPage.cartTotal).toContainText('€20.00');
});