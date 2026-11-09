import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly heading: Locator;

  constructor(private page: Page) {
    this.heading = page.getByText('Ecommerce Starter Template');
  }

  async open() {
    await this.page.goto('/');
  }
}