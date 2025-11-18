import { test, expect } from '@playwright/test';

test.describe('Dark Mode Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display dark mode toggle button', async ({ page }) => {
    const toggleButton = page.locator('#dark-mode-toggle');
    await expect(toggleButton).toBeVisible();
  });

  test('should toggle dark mode on click', async ({ page }) => {
    const toggleButton = page.locator('#dark-mode-toggle');
    const htmlElement = page.locator('html');

    // Check initial state (light mode)
    const initialClass = await htmlElement.getAttribute('class');
    const isDarkModeInitially = initialClass?.includes('dark-mode') ?? false;

    // Click toggle button
    await toggleButton.click();
    await page.waitForTimeout(300); // Wait for transition

    // Check if dark mode class is toggled
    const afterClickClass = await htmlElement.getAttribute('class');
    const isDarkModeAfterClick = afterClickClass?.includes('dark-mode') ?? false;

    expect(isDarkModeAfterClick).not.toBe(isDarkModeInitially);
  });

  test('should persist dark mode preference', async ({ page }) => {
    const toggleButton = page.locator('#dark-mode-toggle');

    // Enable dark mode
    await toggleButton.click();
    await page.waitForTimeout(300);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check if dark mode persists
    const htmlElement = page.locator('html');
    const classAfterReload = await htmlElement.getAttribute('class');
    const isDarkModeAfterReload = classAfterReload?.includes('dark-mode') ?? false;

    // Dark mode should persist through localStorage
    expect(isDarkModeAfterReload).toBeTruthy();
  });

  test('should display correct icon for current mode', async ({ page }) => {
    const toggleButton = page.locator('#dark-mode-toggle');

    // Check initial icon visibility
    const sunIcon = toggleButton.locator('.sun-icon');
    const moonIcon = toggleButton.locator('.moon-icon');

    const sunVisible = await sunIcon.isVisible();
    const moonVisible = await moonIcon.isVisible();

    // Only one icon should be visible at a time
    expect(sunVisible !== moonVisible).toBeTruthy();
  });
});

test.describe('Modal Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open QR Code modal', async ({ page }) => {
    const openQRButton = page.locator('#open-qr');
    await expect(openQRButton).toBeVisible();

    await openQRButton.click();
    await page.waitForTimeout(500);

    // Check if modal content is visible
    const qrImage = page.locator('#qr-image');
    await expect(qrImage).toBeVisible();
  });

  test('QR Code modal should display QR image', async ({ page }) => {
    const openQRButton = page.locator('#open-qr');
    await openQRButton.click();
    await page.waitForTimeout(500);

    const qrImage = page.locator('#qr-image');
    const src = await qrImage.getAttribute('src');

    expect(src).toBeTruthy();
    expect(src).toContain('qr.png');
  });

  test('should open Contact modal', async ({ page }) => {
    const openContactButton = page.locator('#open-contact');
    await expect(openContactButton).toBeVisible();

    await openContactButton.click();
    await page.waitForTimeout(500);

    // Check if download buttons are present
    const downloadButtons = page.locator('.download-contact');
    const count = await downloadButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Contact modal should have VCF download link', async ({ page }) => {
    const openContactButton = page.locator('#open-contact');
    await openContactButton.click();
    await page.waitForTimeout(500);

    const vcfLink = page.locator('a[href="/contact.vcf"]');
    await expect(vcfLink).toBeVisible();
    expect(await vcfLink.getAttribute('download')).toBeTruthy();
  });

  test('should open NFT modal', async ({ page }) => {
    const openNFTButton = page.locator('#open-nft');
    await expect(openNFTButton).toBeVisible();

    await openNFTButton.click();
    await page.waitForTimeout(500);

    // Check if NFT image is visible
    const nftImage = page.locator('.nft-img');
    await expect(nftImage).toBeVisible();
  });
});

test.describe('QR Code / AR Marker Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open QR modal
    const openQRButton = page.locator('#open-qr');
    await openQRButton.click();
    await page.waitForTimeout(500);
  });

  test('should display tap counter on QR image click', async ({ page }) => {
    const qrImage = page.locator('#qr-image');
    const tapCounter = page.locator('#tap-counter');

    // Click once
    await qrImage.click();
    await page.waitForTimeout(100);

    // Tap counter should show progress
    const counterText = await tapCounter.textContent();
    expect(counterText).toBeTruthy();
  });

  test('should switch to AR marker after 5 taps', async ({ page }) => {
    const qrImage = page.locator('#qr-image');
    const tapCounter = page.locator('#tap-counter');

    // Tap 5 times
    for (let i = 0; i < 5; i++) {
      await qrImage.click();
      await page.waitForTimeout(100);
    }

    // Wait for image source to change
    await page.waitForTimeout(300);

    // Check if image source changed to AR marker
    const src = await qrImage.getAttribute('src');
    expect(src).toContain('ar-marker.png');

    // Check if counter shows success message
    const counterText = await tapCounter.textContent();
    expect(counterText).toContain('AR marker');
  });

  test('should reset tap count after timeout', async ({ page }) => {
    const qrImage = page.locator('#qr-image');
    const tapCounter = page.locator('#tap-counter');

    // Tap twice
    await qrImage.click();
    await qrImage.click();
    await page.waitForTimeout(100);

    // Wait for timeout (3 seconds)
    await page.waitForTimeout(3500);

    // Counter should be reset
    const counterText = await tapCounter.textContent();
    expect(counterText?.trim()).toBe('');
  });
});

test.describe('Icon Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display profile icon', async ({ page }) => {
    const myIcon = page.locator('#myicon');
    await expect(myIcon).toBeVisible();
  });

  test('clicking icon should trigger animation', async ({ page }) => {
    const myIcon = page.locator('#myicon');
    const runningDogContainer = page.locator('#running-dog');

    await myIcon.click();
    await page.waitForTimeout(100);

    // Check if dog element was created
    const dogImage = runningDogContainer.locator('img');
    const count = await dogImage.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Contact Information', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display phone number link', async ({ page }) => {
    const phoneLink = page.locator('a[href^="tel:"]');
    await expect(phoneLink).toBeVisible();

    const href = await phoneLink.getAttribute('href');
    expect(href).toContain('tel:');
  });

  test('should display email links', async ({ page }) => {
    const emailLinks = page.locator('a[href^="mailto:"]');
    const count = await emailLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('email links should have correct format', async ({ page }) => {
    const emailLinks = page.locator('a[href^="mailto:"]');
    const firstEmailHref = await emailLinks.first().getAttribute('href');

    expect(firstEmailHref).toBeTruthy();
    expect(firstEmailHref).toMatch(/^mailto:.+@.+/);
  });
});

test.describe('Section Titles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display Publications section', async ({ page }) => {
    const publicationsTitle = page.locator('h2.section-title').filter({ hasText: 'Publications' });
    await expect(publicationsTitle).toBeVisible();
  });

  test('should display Media section', async ({ page }) => {
    const mediaTitle = page.locator('h2.section-title').filter({ hasText: 'Media' });
    await expect(mediaTitle).toBeVisible();
  });
});

test.describe('External Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('external links should open in new tab', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);

    // Check first external link has proper attributes
    const firstLink = externalLinks.first();
    expect(await firstLink.getAttribute('target')).toBe('_blank');
    expect(await firstLink.getAttribute('rel')).toContain('noopener');
  });

  test('social media links should be present', async ({ page }) => {
    // Check for various social media links
    const twitterLink = page.locator('a[href*="twitter.com"]');
    const githubLink = page.locator('a[href*="github.com"]');
    const linkedinLink = page.locator('a[href*="linkedin.com"]');

    await expect(twitterLink).toBeVisible();
    await expect(githubLink).toBeVisible();
    await expect(linkedinLink).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('buttons should have aria-label or text content', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();

      // Button should have either aria-label or text content
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }
  });

  test('images should have alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Images should have alt attribute (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('page should have main heading', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    const text = await h1.textContent();
    expect(text?.trim()).toBeTruthy();
  });
});
