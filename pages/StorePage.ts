import { Locator, Page } from '@playwright/test';

export class StorePage {
  readonly searchInput: Locator;

  constructor(private page: Page) {
    this.searchInput = page.getByTestId('store-search-input');
  }

  async open() {
    await this.page.goto('/dk/store');
  }

  async openProduct(name: string) {
    await this.productLink(name).click();
  }

  productLink(name: string): Locator {
    return this.page.getByRole('link', { name });
  }

  async search(term: string) {
    // Type like a real user. The checkout form showed that this store's inputs
    // can ignore values set with fill() in WebKit.
    await this.searchInput.pressSequentially(term);
  }
}