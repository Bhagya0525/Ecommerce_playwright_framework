import { test, expect } from '../../fixtures';
import AxeBuilder from '@axe-core/playwright';

// Accessibility problems that the Medusa starter store already has.
// The tests fail when a NEW problem appears, or when one of these gets fixed
// (then remove it from the list).
const knownIssues: Record<string, string[]> = {
  home: ['link-name', 'nested-interactive'],
  store: ['link-name', 'nested-interactive'],
  product: ['button-name', 'link-name', 'nested-interactive'],
  cart: ['color-contrast','link-name', 'nested-interactive'],
};

const pagesToScan = [
  { name: 'home', path: '/dk' },
  { name: 'store', path: '/dk/store' },
  { name: 'product', path: '/dk/products/t-shirt' },
  { name: 'cart', path: '/dk/cart' },
];

for (const { name, path } of pagesToScan) {
  test(`${name} page has no new accessibility violations`, { tag: '@a11y' }, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Accessibility scans run once, on Chromium.');
    test.slow();

    await page.goto(path);
    
    await page.getByTestId('nav-cart-link').first().waitFor();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const found = results.violations.map((violation) => violation.id).sort();
    expect(found).toEqual(knownIssues[name]);
  });
}