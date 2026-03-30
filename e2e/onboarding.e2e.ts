/**
 * E2E: User onboarding flow
 * Tags: @smoke @e2e
 *
 * Verifies that a new user can land on the home page and navigate to create a game.
 */

import { test, expect } from '@playwright/test';

test.describe('@smoke User Onboarding', () => {
  test('home page loads and shows call-to-action', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/wilson gaming/i);
    // The CTA that invites kids to create their first game
    await expect(page.getByRole('link', { name: /create/i })).toBeVisible();
  });

  test('navigates to game creation page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /create/i }).first().click();
    await expect(page).toHaveURL('/create');
  });

  test('create page shows prompt input', async ({ page }) => {
    await page.goto('/create');
    await expect(page.getByRole('textbox')).toBeVisible();
  });
});
