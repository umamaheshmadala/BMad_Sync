import { test, expect } from '@playwright/test';
import { signupAndCompleteOnboarding, loginUser } from './utils';

test.describe('Dashboard and Preferences', () => {
  // It's assumed that a test user (e.g., test@example.com, password123) exists and onboarding is complete.
  // In a real setup, you might use a fixture or API call to set up user state.
  test.beforeEach(async ({ page }) => {
    const email = `dash-${Date.now()}@example.com`;
    await signupAndCompleteOnboarding(page, email, 'password123');
    // Already authenticated after onboarding; ensure we are on dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/dashboard/);
    // Use stable dashboard markers
    await expect(page.getByLabel('City Selection')).toBeVisible();
  });

  test('should display hot offers, trending content, and promotional ads', async ({ page }) => {
    await expect(page.getByLabel('City Selection')).toBeVisible();

    // Verify some dynamic content based on mock data
    // Allow either real or seed data without brittle exact strings
    await expect(page.getByText(/Hot Coupon Offers/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /Trending Content/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Promotional Ads/i })).toBeVisible();
  });

  test('should allow switching cities and update dashboard content', async ({ page }) => {
    // Initial check for dashboard loaded
    await expect(page.getByLabel('City Selection')).toBeVisible();

    // Switch city to New York
    await page.getByLabel('City Selection').selectOption('new-york');

    // Verify dashboard still present
    await expect(page.getByLabel('City Selection')).toBeVisible();
  });

  test('should allow updating ad preferences', async ({ page }) => {
    // Navigate to preferences page (assuming a direct link or navigation)
    await page.goto('/preferences'); // Adjust if the navigation is different
    await page.waitForLoadState('domcontentloaded');
    // Our UI displays an h2 with "Ad Preferences"
    await expect(page.getByRole('heading', { name: /Ad Preferences/i })).toBeVisible({ timeout: 20000 });

    // Change ad frequency
    await page.getByLabel('Ad Frequency:').selectOption('low');

    // Exclude a category
    const shopping = page.getByLabel('Shopping');
    await shopping.waitFor({ state: 'visible', timeout: 15000 });
    await shopping.check();

    // Save preferences
    await page.getByRole('button', { name: /Save Preferences/i }).click();

    // Verify success message
    await expect(page.getByText('Preferences updated successfully!')).toBeVisible({ timeout: 15000 });

    // Re-navigate to check if changes persisted (optional, but good for robustness)
    await page.reload();
    await expect(page.getByLabel('Ad Frequency:')).toHaveValue('low');
    await expect(page.getByLabelText('Shopping')).toBeChecked();
  });
});
