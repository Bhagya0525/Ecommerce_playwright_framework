import { test as base } from '@playwright/test';
import { StorePage } from '../pages/StorePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { StoreApi } from '../api/StoreApi';

type Fixtures = {
  storePage: StorePage;
  productPage: ProductPage;
  cartPage: CartPage;
  storeApi: StoreApi;
};

export const test = base.extend<Fixtures>({
  storePage: async ({ page }, use) => {
    await use(new StorePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  storeApi: async ({ request }, use) => {
    await use(new StoreApi(request));
  },
});

export { expect } from '@playwright/test';