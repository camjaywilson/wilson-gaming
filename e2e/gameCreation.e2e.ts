/**
 * E2E: Game creation wizard
 * Tags: @smoke @regression @e2e
 *
 * Covers the full game creation flow: enter prompt → generate → view game.
 * NOTE: Tests that call the Anthropic API are skipped in CI unless
 *       ANTHROPIC_API_KEY is set in the environment.
 */

import { test, expect } from '@playwright/test';

test.describe('@smoke Game Creation Wizard', () => {
  test('create page shows prompt input and submit button', async ({ page }) => {
    await page.goto('/create');

    const promptInput = page.getByRole('textbox');
    const submitButton = page.getByRole('button', { name: /create|generate|make/i });

    await expect(promptInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('submit button is disabled when prompt is empty', async ({ page }) => {
    await page.goto('/create');

    const submitButton = page.getByRole('button', { name: /create|generate|make/i });
    // Button should be disabled or input validation should prevent submission
    const isEmpty = await page.getByRole('textbox').inputValue();
    if (isEmpty === '') {
      // Either button is disabled, or form has validation
      const isDisabled = await submitButton.isDisabled();
      const hasRequired = await page.getByRole('textbox').getAttribute('required');
      expect(isDisabled || hasRequired !== null).toBeTruthy();
    }
  });

  test('@regression full creation flow with API', async ({ page }) => {
    // Skip if no API key configured (CI environment without secrets)
    test.skip(!process.env.ANTHROPIC_API_KEY, 'Skipped: ANTHROPIC_API_KEY not set');

    await page.goto('/create');
    await page.getByRole('textbox').fill('A simple game where a frog jumps over logs');
    await page.getByRole('button', { name: /create|generate|make/i }).click();

    // Should show a loading state
    await expect(page.getByText(/generating|creating|loading/i)).toBeVisible({ timeout: 5_000 });

    // Should eventually navigate to the game page
    await expect(page).toHaveURL(/\/game\//, { timeout: 30_000 });

    // Game page should render an iframe or canvas
    await expect(page.locator('iframe, canvas')).toBeVisible({ timeout: 10_000 });
  });
});
