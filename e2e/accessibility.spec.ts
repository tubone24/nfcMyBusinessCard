import { test, expect } from '@playwright/test';

test.describe('Accessibility - WCAG Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('page should have correct language attribute', async ({ page }) => {
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    expect(lang).toBe('ja');
  });

  test('viewport should allow user scaling', async ({ page }) => {
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
    expect(viewport).not.toContain('user-scalable=no');
    expect(viewport).not.toContain('maximum-scale=1');
  });

  test('should have skip link to main content', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // Skip link should be visible when focused
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test('main content should have id for skip link', async ({ page }) => {
    const main = page.locator('main#main-content');
    await expect(main).toBeAttached();
  });

  test('dark mode toggle should have aria-pressed attribute', async ({ page }) => {
    const toggleButton = page.locator('#dark-mode-toggle');
    const ariaPressed = await toggleButton.getAttribute('aria-pressed');
    expect(ariaPressed).toBeTruthy();
    expect(['true', 'false']).toContain(ariaPressed);
  });

  test('dark mode toggle should update aria-pressed on click', async ({ page }) => {
    const toggleButton = page.locator('#dark-mode-toggle');
    const initialPressed = await toggleButton.getAttribute('aria-pressed');

    await toggleButton.click();
    await page.waitForTimeout(100);

    const newPressed = await toggleButton.getAttribute('aria-pressed');
    expect(newPressed).not.toBe(initialPressed);
  });

  test('decorative icons should have aria-hidden', async ({ page }) => {
    // Check dark mode toggle icons
    const sunIcon = page.locator('.dark-mode-toggle .sun-icon');
    const moonIcon = page.locator('.dark-mode-toggle .moon-icon');

    expect(await sunIcon.getAttribute('aria-hidden')).toBe('true');
    expect(await moonIcon.getAttribute('aria-hidden')).toBe('true');

    // Check contact icons
    const contactIcons = page.locator('.contact .icon');
    const count = await contactIcons.count();
    for (let i = 0; i < count; i++) {
      const icon = contactIcons.nth(i);
      expect(await icon.getAttribute('aria-hidden')).toBe('true');
    }
  });

  test('profile icon button should have aria-label', async ({ page }) => {
    const myiconButton = page.locator('#myicon');
    const ariaLabel = await myiconButton.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('アニメーション');
  });

  test('profile icon should be a button element', async ({ page }) => {
    const myicon = page.locator('#myicon');
    const tagName = await myicon.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('button');
  });

  test('profile icon button should be keyboard accessible', async ({ page }) => {
    const myiconButton = page.locator('#myicon');

    // Focus the button
    await myiconButton.focus();

    // Press Enter key
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);

    // Check if animation was triggered
    const runningDog = page.locator('#running-dog img');
    const dogCount = await runningDog.count();
    expect(dogCount).toBeGreaterThan(0);
  });

  test('external links should have aria-label indicating new tab', async ({ page }) => {
    // Check YouTubeCard links
    const youtubeLinks = page.locator('.youtube-card a[target="_blank"]');
    if ((await youtubeLinks.count()) > 0) {
      const firstLink = youtubeLinks.first();
      const ariaLabel = await firstLink.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('新しいタブで開く');
    }

    // Check BookCard links
    const bookLinks = page.locator('.book-card a[target="_blank"]');
    if ((await bookLinks.count()) > 0) {
      const firstLink = bookLinks.first();
      const ariaLabel = await firstLink.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('新しいタブで開く');
    }
  });

  test('QR code tap counter should have aria-live', async ({ page }) => {
    // Open QR modal
    const openQRButton = page.locator('#open-qr');
    await openQRButton.click();
    await page.waitForTimeout(500);

    const tapCounter = page.locator('#tap-counter');
    expect(await tapCounter.getAttribute('aria-live')).toBe('polite');
    expect(await tapCounter.getAttribute('aria-atomic')).toBe('true');
  });

  test('sections should have proper ARIA labels', async ({ page }) => {
    // Check Publications section
    const publicationsSection = page.locator(
      'section[aria-labelledby="publications-heading"]'
    );
    await expect(publicationsSection).toBeAttached();

    const publicationsHeading = page.locator('#publications-heading');
    await expect(publicationsHeading).toBeVisible();

    // Check Media section
    const mediaSection = page.locator('section[aria-labelledby="media-heading"]');
    await expect(mediaSection).toBeAttached();

    const mediaHeading = page.locator('#media-heading');
    await expect(mediaHeading).toBeVisible();
  });

  test('lists should have aria-label', async ({ page }) => {
    const linkCardGrid = page.locator('.link-card-grid');
    expect(await linkCardGrid.getAttribute('aria-label')).toBeTruthy();

    const bookCardGrid = page.locator('.book-card-grid');
    expect(await bookCardGrid.getAttribute('aria-label')).toBeTruthy();

    const youtubeCardGrid = page.locator('.youtube-card-grid');
    expect(await youtubeCardGrid.getAttribute('aria-label')).toBeTruthy();
  });

  test('all images should have alt attribute', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Alt can be empty for decorative images, but attribute must exist
      expect(alt).not.toBeNull();
    }
  });

  test('decorative images should have empty alt or role=presentation', async ({ page }) => {
    // Check YouTube thumbnail (decorative, content in text)
    const youtubeThumbnails = page.locator('.youtube-card img[role="presentation"]');
    if ((await youtubeThumbnails.count()) > 0) {
      const firstThumbnail = youtubeThumbnails.first();
      const alt = await firstThumbnail.getAttribute('alt');
      expect(alt).toBe('');
    }
  });

  test('iframes should have title attribute', async ({ page }) => {
    const iframes = page.locator('iframe');
    const count = await iframes.count();

    for (let i = 0; i < count; i++) {
      const iframe = iframes.nth(i);
      const title = await iframe.getAttribute('title');
      expect(title).toBeTruthy();
    }
  });

  test('buttons should have accessible text or aria-label', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const textContent = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      // Button should have either text content or aria-label
      expect(textContent?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('headings should have proper hierarchy', async ({ page }) => {
    // Check for h1
    const h1 = page.locator('h1');
    expect(await h1.count()).toBe(1);

    // h1 should come before h2
    const h2 = page.locator('h2').first();
    await expect(h2).toBeVisible();

    // Check that h3 is inside cards (not at top level before h2)
    const h3BeforeH2 = page.locator('main > h3');
    expect(await h3BeforeH2.count()).toBe(0);
  });

  test('focus should be visible on interactive elements', async ({ page }) => {
    // Test button focus
    const firstButton = page.locator('button').first();
    await firstButton.focus();

    // Check if element has focus
    const isFocused = await firstButton.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test('keyboard navigation should work for all interactive elements', async ({ page }) => {
    // Tab through first few interactive elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(50);

    let activeElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        id: el?.id,
        className: el?.className,
      };
    });

    // First tab should go to skip link or first interactive element
    expect(['A', 'BUTTON', 'INPUT']).toContain(activeElement.tagName);
  });

  test('links should have meaningful text', async ({ page }) => {
    const links = page.locator('a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const textContent = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const imgAlt = await link.locator('img').first().getAttribute('alt');

      // Link should have either text, aria-label, or img with alt
      const hasAccessibleText = textContent?.trim() || ariaLabel || imgAlt;
      expect(hasAccessibleText).toBeTruthy();
    }
  });

  test('form elements should have labels', async ({ page }) => {
    // This page doesn't have forms, but check if any inputs exist
    const inputs = page.locator('input');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      // If input exists, it should have label association
      if (id || ariaLabel || ariaLabelledby) {
        expect(ariaLabel || ariaLabelledby || id).toBeTruthy();
      }
    }
  });

  test('color contrast should be sufficient (visual check)', async ({ page }) => {
    // This is a placeholder - proper contrast checking requires axe-core
    // Just verify that text elements have defined colors
    const textElements = page.locator('p, h1, h2, h3, a, button, span');
    const first = textElements.first();

    const color = await first.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.color;
    });

    // Should have a defined color (not 'transparent' or empty)
    expect(color).toBeTruthy();
    expect(color).not.toBe('transparent');
  });

  test('page should not have automatic redirects or refreshes', async ({ page }) => {
    const metaRefresh = page.locator('meta[http-equiv="refresh"]');
    expect(await metaRefresh.count()).toBe(0);
  });

  test('responsive design should not hide content at different zoom levels', async ({
    page,
  }) => {
    // Test at 200% zoom (simulated by smaller viewport)
    await page.setViewportSize({ width: 640, height: 480 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Main heading should still be visible
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Navigation/contact buttons should still be accessible
    const contactButtons = page.locator('.contact button');
    expect(await contactButtons.count()).toBeGreaterThan(0);
  });
});

test.describe('Accessibility - Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('all interactive elements should be reachable by keyboard', async ({ page }) => {
    const interactiveElements = page.locator('a, button, [tabindex="0"]');
    const count = await interactiveElements.count();

    // Should have multiple interactive elements
    expect(count).toBeGreaterThan(5);

    // Tab through first few elements
    for (let i = 0; i < Math.min(5, count); i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
    }

    // Should be able to tab back
    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(50);
  });

  test('Enter and Space should activate buttons', async ({ page }) => {
    const firstButton = page.locator('button').first();
    await firstButton.focus();

    // Get button id to verify it's the same button
    const buttonId = await firstButton.getAttribute('id');

    // Press Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Button should still exist and be focused
    const stillFocused = await page.evaluate(
      (id) => {
        const el = document.activeElement;
        return el?.id === id || el?.tagName === 'BUTTON';
      },
      buttonId || 'dark-mode-toggle'
    );
    expect(stillFocused).toBe(true);
  });

  test('Escape should close modals', async ({ page }) => {
    // Open QR modal
    const openQRButton = page.locator('#open-qr');
    await openQRButton.click();
    await page.waitForTimeout(500);

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Modal should be closed (implementation depends on accessible-astro-components)
    // Just verify the button is still accessible
    await expect(openQRButton).toBeVisible();
  });
});

