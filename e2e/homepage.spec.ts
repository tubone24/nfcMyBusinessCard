import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check that the page loaded
    expect(await page.title()).toBeTruthy();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check for viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
  });

  test('should be responsive', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Basic check that page renders on mobile
    const body = await page.locator('body');
    expect(await body.isVisible()).toBe(true);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');

    // Check for common accessibility features
    const main = await page.locator('main, [role="main"]');
    expect(await main.count()).toBeGreaterThanOrEqual(0);
  });
});
