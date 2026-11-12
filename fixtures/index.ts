import { test as base } from '@playwright/test';
import { StorePage } from '../pages/StorePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { StoreApi } from '../api/StoreApi';
import { HomePage } from '../pages/HomePage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { products } from '../test-data/products';

type Fixtures = {
  homePage: HomePage;
  storePage: StorePage;
  productPage: ProductPage;
  cartPage: CartPage;
  storeApi: StoreApi;
  checkoutPage: CheckoutPage;
  cartWithTshirt: string;
};

export const test = base.extend<Fixtures>({
    homePage: async ({ page }, use) => {
    await use(new HomePage(page));
    },
  storePage: async ({ page }, use) => {
    await use(new StorePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  storeApi: async ({ request }, use) => {
    await use(new StoreApi(request));
  },
    cartWithTshirt: async ({ storeApi, context }, use) => {
    const variantId = await storeApi.getVariantId(products.tshirt.title);
    const cartId = await storeApi.createCart();
    await storeApi.addToCart(cartId, variantId, 1);
    await context.addCookies([
      { name: '_medusa_cart_id', value: cartId, domain: 'localhost', path: '/' },
    ]);
    await use(cartId);
  },
});

export { expect } from '@playwright/test';