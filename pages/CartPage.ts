import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly productTitle: Locator;
  readonly productVariant: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.productTitle = page.getByTestId('product-title');
    this.productVariant = page.getByTestId('product-variant');
    this.cartTotal = page.getByTestId('cart-total');
  }
}