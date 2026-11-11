import { expect, Locator, Page } from '@playwright/test';
import { Customer } from '../test-data/customer';

export class CheckoutPage {
  readonly submitAddressButton: Locator;
  readonly submitDeliveryButton: Locator;
  readonly submitPaymentButton: Locator;
  readonly placeOrderButton: Locator;

  constructor(private page: Page) {
    this.submitAddressButton = page.getByTestId('submit-address-button');
    this.submitDeliveryButton = page.getByTestId('submit-delivery-option-button');
    this.submitPaymentButton = page.getByTestId('submit-payment-button');
    this.placeOrderButton = page.getByTestId('submit-order-button');
  }

  async open() {
    await this.page.goto('/dk/checkout?step=address');
  }

      async fillShippingAddress(customer: Customer) {
    // Type the first name key by key, like a real user. In WebKit this form loses a value
    // that was set with fill() until it has registered keyboard input.
    const firstName = this.page.getByTestId('shipping-first-name-input');
    await firstName.pressSequentially(customer.firstName);
    await this.page.getByTestId('shipping-last-name-input').fill(customer.lastName);
    await this.page.getByTestId('shipping-address-input').fill(customer.address);
    await this.page.getByTestId('shipping-postal-code-input').fill(customer.postalCode);
    await this.page.getByTestId('shipping-city-input').fill(customer.city);
    await this.page.getByTestId('shipping-country-select').selectOption(customer.countryCode);
    await this.page.getByTestId('shipping-email-input').fill(customer.email);
    await this.page.getByTestId('shipping-phone-input').fill(customer.phone);
    await expect(firstName).toHaveValue(customer.firstName);
    await this.submitAddressButton.click();
  }

  async chooseStandardShipping() {
    await this.page
      .getByRole('radio', { name: 'Standard Shipping €' })
      .getByTestId('radio-button')
      .click();
    await this.submitDeliveryButton.click();
  }

    async choosePayment() {
    await this.page
      .getByRole('radio', { name: 'Manual Payment' })
      .getByTestId('radio-button')
      .click();
    await this.submitPaymentButton.click();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}