import { APIRequestContext, expect } from '@playwright/test';

export class StoreApi {
  private apiUrl = process.env.MEDUSA_API_URL;
  private headers = { 'x-publishable-api-key': process.env.MEDUSA_PUBLISHABLE_KEY ?? '' };

  constructor(private request: APIRequestContext) {}

  async getVariantId(productTitle: string): Promise<string> {
    const response = await this.request.get(`${this.apiUrl}/store/products?fields=*variants`, {
      headers: this.headers,
    });
    expect(response.ok()).toBeTruthy();

    const { products } = await response.json();
    const product = products.find((item: { title: string }) => item.title === productTitle);
    return product.variants[0].id;
  }

  async createCart(): Promise<string> {
    const regionsResponse = await this.request.get(`${this.apiUrl}/store/regions`, {
      headers: this.headers,
    });
    const { regions } = await regionsResponse.json();

    const cartResponse = await this.request.post(`${this.apiUrl}/store/carts`, {
      headers: this.headers,
      data: { region_id: regions[0].id },
    });
    expect(cartResponse.ok()).toBeTruthy();

    const { cart } = await cartResponse.json();
    return cart.id;
  }

  async addToCart(cartId: string, variantId: string, quantity: number) {
    const response = await this.request.post(`${this.apiUrl}/store/carts/${cartId}/line-items`, {
      headers: this.headers,
      data: { variant_id: variantId, quantity },
    });
    expect(response.ok()).toBeTruthy();

    const { cart } = await response.json();
    return cart;
  }
    async tryAddToCart(cartId: string, variantId: string, quantity: number) {
    return this.request.post(`${this.apiUrl}/store/carts/${cartId}/line-items`, {
      headers: this.headers,
      data: { variant_id: variantId, quantity },
    });
  }
}