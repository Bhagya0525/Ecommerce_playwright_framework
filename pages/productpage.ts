import { Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly addToCartButton: Locator;
  readonly cartLink: Locator;

  constructor(private page: Page) {
    this.addToCartButton = page.getByTestId('add-product-button');
    this.cartLink = page.getByTestId('nav-cart-link');
  }

   async selectSize(size: string) {
    await this.page.getByText(size, { exact: true }).click();
  }

  async selectColor(color: string) {
    await this.page.getByText(color, { exact: true }).click();
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}