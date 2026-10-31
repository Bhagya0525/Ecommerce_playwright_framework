import { Page } from '@playwright/test';

export class StorePage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/dk/store');
  }

  async openProduct(name: string) {
    await this.page.getByRole('link', { name }).click();
  }
}