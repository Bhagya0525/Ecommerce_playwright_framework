import { test, expect } from '../../fixtures';

const PAGE_LOAD_BUDGET_MS = 5000;

test('the store page loads within the time budget', { tag: '@perf' }, async ({ page, storePage, browserName }) => {
  test.skip(browserName !== 'chromium', 'Timing checks run once, on Chromium.');
  test.slow();

  await storePage.open();
  await storePage.open();

  const loadTime = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return Math.round(nav.loadEventEnd);
  });

  expect(loadTime, 'page load time in ms').toBeLessThan(PAGE_LOAD_BUDGET_MS);
});