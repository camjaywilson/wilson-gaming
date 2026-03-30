/**
 * E2E: Game play loop
 * Tags: @smoke @regression @e2e
 *
 * Tests the gallery page and individual game play page.
 */

import { test, expect } from '@playwright/test';

test.describe('@smoke Game Gallery', () => {
  test('gallery page loads', async ({ page }) => {
    await page.goto('/gallery');
    // Should render a heading or grid (may be empty on fresh install)
    await expect(page.locator('body')).toBeVisible();
    // No JS errors
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('gallery page renders grid or empty state message', async ({ page }) => {
    await page.goto('/gallery');
    // Either a grid of game cards or an empty-state message should render
    const hasCards = await page.locator('a[href^="/game/"]').count() > 0;
    const hasEmptyState = await page.getByText(/no games|be the first|create/i).isVisible().catch(() => false);
    expect(hasCards || hasEmptyState).toBeTruthy();
  });
});

test.describe('@regression Game Play Page', () => {
  test('navigating to an invalid game id shows an error or redirect', async ({ page }) => {
    const response = await page.goto('/game/does-not-exist-12345');
    // Should either be a 404 page or redirect to home — not a 500
    if (response) {
      expect(response.status()).not.toBe(500);
    }
  });
});
