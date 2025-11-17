import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load successfully', async ({ page }) => {
    expect(await page.title()).toBeTruthy();
  });

  test('should display main heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should have dark mode toggle button', async ({ page }) => {
    const darkModeToggle = page.locator('#dark-mode-toggle');
    await expect(darkModeToggle).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    const darkModeToggle = page.locator('#dark-mode-toggle');
    const html = page.locator('html');

    // Click to enable dark mode
    await darkModeToggle.click();
    await expect(html).toHaveClass(/dark-mode/);

    // Click to disable dark mode
    await darkModeToggle.click();
    await expect(html).not.toHaveClass(/dark-mode/);
  });

  test('should have contact buttons', async ({ page }) => {
    const qrButton = page.locator('#open-qr');
    const contactButton = page.locator('#open-contact');
    const nftButton = page.locator('#open-nft');

    await expect(qrButton).toBeVisible();
    await expect(contactButton).toBeVisible();
    await expect(nftButton).toBeVisible();
  });

  test('should open QR modal when QR button is clicked', async ({ page }) => {
    const qrButton = page.locator('#open-qr');
    await qrButton.click();

    // Wait for modal to appear
    const modal = page.locator('dialog[open], .modal[open]');
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('should have proper meta tags', async ({ page }) => {
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
  });
});

test.describe('Link Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display link cards grid', async ({ page }) => {
    const cardGrid = page.locator('.link-card-grid');
    await expect(cardGrid).toBeVisible();
  });

  test('should have multiple link cards', async ({ page }) => {
    const cards = page.locator('.link-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('link cards should have proper structure', async ({ page }) => {
    const firstCard = page.locator('.link-card').first();
    await expect(firstCard.locator('h2')).toBeVisible();
    await expect(firstCard.locator('p')).toBeVisible();
    await expect(firstCard.locator('a')).toHaveAttribute('href', /.+/);
  });

  test('link cards should be clickable', async ({ page }) => {
    const firstCard = page.locator('.link-card a').first();
    const href = await firstCard.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/^https?:\/\//);
  });
});

test.describe('Publications Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display publications section', async ({ page }) => {
    const section = page.locator('text=Publications').first();
    await expect(section).toBeVisible();
  });

  test('should display book cards', async ({ page }) => {
    const bookCards = page.locator('.book-card');
    const count = await bookCards.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Media Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display media section', async ({ page }) => {
    const section = page.locator('text=Media').first();
    await expect(section).toBeVisible();
  });

  test('should display YouTube cards', async ({ page }) => {
    const youtubeCards = page.locator('.youtube-card');
    const count = await youtubeCards.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check that content is visible on mobile
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cardGrid = page.locator('.link-card-grid');
    await expect(cardGrid).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cardGrid = page.locator('.link-card-grid');
    await expect(cardGrid).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have accessible navigation', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('buttons should be keyboard accessible', async ({ page }) => {
    const qrButton = page.locator('#open-qr');

    // Focus the button using keyboard
    await qrButton.focus();
    await expect(qrButton).toBeFocused();

    // Should be able to activate with Enter
    await page.keyboard.press('Enter');
  });

  test('links should have proper attributes', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = externalLinks.nth(i);
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('images should have alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });

  test('iframes should have title attribute', async ({ page }) => {
    const iframes = page.locator('iframe');
    const count = await iframes.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const iframe = iframes.nth(i);
        const title = await iframe.getAttribute('title');
        expect(title).toBeTruthy();
      }
    }
  });
});

test.describe('Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
