import { test, expect } from '@playwright/test';
import { StoreApi } from '../../api/StoreApi';
import { CartPage } from '../../pages/CartPage';

test('a cart created through the API appears in the storefront', async ({ request, context, page }) => {
  const storeApi = new StoreApi(request);
  const cartPage = new CartPage(page);

  // Build the cart through the API
  const variantId = await storeApi.getVariantId('Medusa T-Shirt');
  const cartId = await storeApi.createCart();
  await storeApi.addToCart(cartId, variantId, 2);

  // Tell the browser "this is my cart"
  await context.addCookies([
    { name: '_medusa_cart_id', value: cartId, domain: 'localhost', path: '/' },
  ]);

  // Open the cart page and check what the shopper sees
  await page.goto('/dk/cart');
  await expect(cartPage.productTitle).toHaveText('Medusa T-Shirt');
  await expect(cartPage.cartTotal).toContainText('€20.00');
});