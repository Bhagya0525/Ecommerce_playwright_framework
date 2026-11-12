import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly productTitle: Locator;
  readonly productVariant: Locator;
  readonly cartTotal: Locator;
  readonly productRows: Locator;
  readonly quantitySelect: Locator;

  constructor(private page: Page) {
    this.productTitle = page.getByTestId('product-title');
    this.productVariant = page.getByTestId('product-variant');
    this.cartTotal = page.getByTestId('cart-total');
    this.productRows = page.getByTestId('product-row');
    this.quantitySelect = page.getByTestId('product-select-button');
  }

  async open() {
    await this.page.goto('/dk/cart');
  }

  async setQuantity(quantity: number) {
    await this.quantitySelect.selectOption(String(quantity));
  }

  async removeItem() {
    await this.productRows.getByRole('button').click();
  }
}