import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load successfully', async ({ page }) => {
    // Check that the page loaded
    expect(await page.title()).toBeTruthy();
    expect(await page.title()).toContain('tubone24');
  });

  test('should display main heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const headingText = await heading.textContent();
    expect(headingText).toContain('Yu Otsubo');
  });

  test('should display profile information', async ({ page }) => {
    // Check for job title
    const jobTitle = page.locator('text=Full Cycle Engineer');
    await expect(jobTitle).toBeVisible();

    // Check for company link
    const companyLink = page.locator('a[href="https://kddi-agile.com/"]');
    await expect(companyLink).toBeVisible();
  });

  test('should display profile icon', async ({ page }) => {
    const icon = page.locator('#myicon');
    await expect(icon).toBeVisible();
    expect(await icon.getAttribute('src')).toContain('icon.png');
    expect(await icon.getAttribute('alt')).toBe('my icon');
  });

  test('should display contact buttons', async ({ page }) => {
    const qrButton = page.locator('#open-qr');
    const contactButton = page.locator('#open-contact');
    const nftButton = page.locator('#open-nft');

    await expect(qrButton).toBeVisible();
    await expect(contactButton).toBeVisible();
    await expect(nftButton).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check for viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that main elements are visible
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should have accessible main landmark', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
    expect(await main.count()).toBe(1);
  });

  test('should display all sections', async ({ page }) => {
    // Check for Publications section
    const publicationsSection = page.locator('h2.section-title').filter({ hasText: 'Publications' });
    await expect(publicationsSection).toBeVisible();

    // Check for Media section
    const mediaSection = page.locator('h2.section-title').filter({ hasText: 'Media' });
    await expect(mediaSection).toBeVisible();
  });

  test('should have link card grid', async ({ page }) => {
    const linkCardGrid = page.locator('.link-card-grid');
    await expect(linkCardGrid).toBeVisible();

    const cards = await linkCardGrid.locator('.link-card').all();
    expect(cards.length).toBeGreaterThan(0);
  });

  test('should have book card grid', async ({ page }) => {
    const bookCardGrid = page.locator('.book-card-grid');
    await expect(bookCardGrid).toBeVisible();

    const cards = await bookCardGrid.locator('.book-card').all();
    expect(cards.length).toBeGreaterThan(0);
  });

  test('should have media card grid', async ({ page }) => {
    const mediaCardGrid = page.locator('.youtube-card-grid');
    await expect(mediaCardGrid).toBeVisible();

    const cards = await mediaCardGrid.locator('.youtube-card, .spotify-card').all();
    expect(cards.length).toBeGreaterThan(0);
  });

  test('page should have good performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Page should load in reasonable time (less than 10 seconds)
    expect(loadTime).toBeLessThan(10000);
  });
});
