import { test, expect } from '@playwright/test';

test.describe('Card Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should render Card components with correct structure', async ({ page }) => {
    // Check if Card components are rendered
    const cards = await page.locator('.link-card').all();
    expect(cards.length).toBeGreaterThan(0);

    // Check first card structure
    const firstCard = page.locator('.link-card').first();
    await expect(firstCard.locator('h2')).toBeVisible();
    await expect(firstCard.locator('p')).toBeVisible();
    await expect(firstCard.locator('a')).toHaveAttribute('href');
  });

  test('should render Card with icon', async ({ page }) => {
    const firstCard = page.locator('.link-card').first();
    const icon = firstCard.locator('[data-icon]');
    await expect(icon).toBeVisible();
  });

  test('Card should have hover effect', async ({ page }) => {
    const firstCard = page.locator('.link-card').first();

    // Check initial state
    await expect(firstCard).toBeVisible();

    // Hover over card
    await firstCard.hover();

    // The card should still be visible after hover
    await expect(firstCard).toBeVisible();
  });

  test('Card links should be clickable and have correct href', async ({ page }) => {
    const firstCardLink = page.locator('.link-card a').first();
    const href = await firstCardLink.getAttribute('href');

    expect(href).toBeTruthy();
    expect(href).toMatch(/^https?:\/\/.+/);
  });
});

test.describe('BookCard Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should render BookCard components', async ({ page }) => {
    const bookCards = await page.locator('.book-card').all();
    expect(bookCards.length).toBeGreaterThan(0);
  });

  test('BookCard should display title, author, and description', async ({ page }) => {
    const firstBookCard = page.locator('.book-card').first();

    await expect(firstBookCard.locator('.book-title')).toBeVisible();
    await expect(firstBookCard.locator('.book-author')).toBeVisible();
    await expect(firstBookCard.locator('.book-description')).toBeVisible();
  });

  test('BookCard should display book cover image', async ({ page }) => {
    const firstBookCard = page.locator('.book-card').first();
    const bookImage = firstBookCard.locator('.book-image');

    await expect(bookImage).toBeVisible();
    const src = await bookImage.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('BookCard link should open in new tab', async ({ page }) => {
    const firstBookCardLink = page.locator('.book-card a').first();
    const target = await firstBookCardLink.getAttribute('target');
    const rel = await firstBookCardLink.getAttribute('rel');

    expect(target).toBe('_blank');
    expect(rel).toBe('noopener noreferrer');
  });
});

test.describe('YouTubeCard Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should render YouTubeCard components', async ({ page }) => {
    const youtubeCards = await page.locator('.youtube-card').all();
    expect(youtubeCards.length).toBeGreaterThan(0);
  });

  test('YouTubeCard should display video information', async ({ page }) => {
    const firstYoutubeCard = page.locator('.youtube-card').first();

    await expect(firstYoutubeCard.locator('h3')).toBeVisible();
    await expect(firstYoutubeCard.locator('.channel-name')).toBeVisible();
    await expect(firstYoutubeCard.locator('.description')).toBeVisible();
  });

  test('YouTubeCard should display thumbnail and play button', async ({ page }) => {
    const firstYoutubeCard = page.locator('.youtube-card').first();

    await expect(firstYoutubeCard.locator('.card-image img')).toBeVisible();
    await expect(firstYoutubeCard.locator('.play-button')).toBeVisible();
  });

  test('YouTubeCard thumbnail should have correct source', async ({ page }) => {
    const firstYoutubeCard = page.locator('.youtube-card').first();
    const thumbnail = firstYoutubeCard.locator('.card-image img');
    const src = await thumbnail.getAttribute('src');

    expect(src).toBeTruthy();
    expect(src).toContain('img.youtube.com');
  });

  test('YouTubeCard link should point to YouTube', async ({ page }) => {
    const firstYoutubeCardLink = page.locator('.youtube-card a').first();
    const href = await firstYoutubeCardLink.getAttribute('href');

    expect(href).toBeTruthy();
    expect(href).toContain('youtube.com/watch');
  });
});

test.describe('SpotifyCard Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should render SpotifyCard components', async ({ page }) => {
    const spotifyCards = await page.locator('.spotify-card').all();
    expect(spotifyCards.length).toBeGreaterThan(0);
  });

  test('SpotifyCard should display episode information', async ({ page }) => {
    const firstSpotifyCard = page.locator('.spotify-card').first();

    await expect(firstSpotifyCard.locator('h3')).toBeVisible();
    await expect(firstSpotifyCard.locator('.show-name')).toBeVisible();
    await expect(firstSpotifyCard.locator('.description')).toBeVisible();
  });

  test('SpotifyCard should display embedded player', async ({ page }) => {
    const firstSpotifyCard = page.locator('.spotify-card').first();
    const iframe = firstSpotifyCard.locator('iframe');

    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute('src');
    expect(src).toContain('open.spotify.com/embed');
  });

  test('SpotifyCard link should point to Spotify', async ({ page }) => {
    const firstSpotifyCardLink = page.locator('.spotify-card a').first();
    const href = await firstSpotifyCardLink.getAttribute('href');

    expect(href).toBeTruthy();
    expect(href).toContain('open.spotify.com/episode');
  });
});

test.describe('Responsive Design', () => {
  test('Components should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that cards are visible on mobile
    await expect(page.locator('.link-card').first()).toBeVisible();
  });

  test('Components should be visible on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.link-card').first()).toBeVisible();
    await expect(page.locator('.book-card').first()).toBeVisible();
  });

  test('Components should be visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.link-card').first()).toBeVisible();
    await expect(page.locator('.book-card').first()).toBeVisible();
    await expect(page.locator('.youtube-card').first()).toBeVisible();
  });
});

test.describe('Grid Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('link-card-grid should display cards in grid', async ({ page }) => {
    const grid = page.locator('.link-card-grid');
    await expect(grid).toBeVisible();

    const cards = await grid.locator('.link-card').all();
    expect(cards.length).toBeGreaterThan(1);
  });

  test('book-card-grid should display books in grid', async ({ page }) => {
    const grid = page.locator('.book-card-grid');
    await expect(grid).toBeVisible();

    const cards = await grid.locator('.book-card').all();
    expect(cards.length).toBeGreaterThan(0);
  });

  test('youtube-card-grid should display videos in grid', async ({ page }) => {
    const grid = page.locator('.youtube-card-grid');
    await expect(grid).toBeVisible();

    const cards = await grid.locator('.youtube-card, .spotify-card').all();
    expect(cards.length).toBeGreaterThan(0);
  });
});
