import { test as base } from '@playwright/test';
import { StorePage } from '../pages/StorePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { StoreApi } from '../api/StoreApi';
import { HomePage } from '../pages/HomePage';
import { CheckoutPage } from '../pages/CheckoutPage';

type Fixtures = {
  homePage: HomePage;
  storePage: StorePage;
  productPage: ProductPage;
  cartPage: CartPage;
  storeApi: StoreApi;
  checkoutPage: CheckoutPage;
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
});

export { expect } from '@playwright/test';