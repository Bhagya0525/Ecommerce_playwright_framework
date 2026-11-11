import { test, expect } from '../../fixtures';
import { products } from '../../test-data/products';
import { customer } from '../../test-data/customer';

test('a guest can place an order for a cart created through the API', async ({
  storeApi,
  checkoutPage,
  context,
  page,
}) => {
  // A long journey on a dev-mode storefront, so allow three times the normal time.
  test.slow();

  // Build the cart through the API
  const variantId = await storeApi.getVariantId(products.tshirt.title);
  const cartId = await storeApi.createCart();
  await storeApi.addToCart(cartId, variantId, 1);

  // Tell the browser "this is my cart"
  await context.addCookies([
    { name: '_medusa_cart_id', value: cartId, domain: 'localhost', path: '/' },
  ]);

  // Go through the checkout pages
  await checkoutPage.open();
  await checkoutPage.fillShippingAddress(customer);
  await checkoutPage.chooseStandardShipping();
  await checkoutPage.choosePayment();
  await checkoutPage.placeOrder();

  // The shopper lands on the order confirmation page
  await expect(page).toHaveURL(/\/order\/.+\/confirmed/, { timeout: 45000 });
});