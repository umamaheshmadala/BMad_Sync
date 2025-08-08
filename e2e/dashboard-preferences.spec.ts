import { test, expect } from '@playwright/test';

test.describe('Dashboard and Preferences', () => {
  // It's assumed that a test user (e.g., test@example.com, password123) exists and onboarding is complete.
  // In a real setup, you might use a fixture or API call to set up user state.
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /Sign in/i }).click();
    await page.waitForURL(/dashboard/);
    await expect(page.getByText('Welcome to your Dashboard!')).toBeVisible();
  });

  test('should display hot offers, trending content, and promotional ads', async ({ page }) => {
    await expect(page.getByText(/Hot Coupon Offers/i)).toBeVisible();
    await expect(page.getByText(/Trending Content/i)).toBeVisible();
    await expect(page.getByText(/Promotional Ads/i)).toBeVisible();

    // Verify some dynamic content based on mock data
    await expect(page.getByText(/Hot Pizza in London/i)).toBeVisible();
    await expect(page.getByText(/Trending New Restaurant in London/i)).toBeVisible();
    await expect(page.getByText(/Ad for Fashion Sale/i)).toBeVisible();
  });

  test('should allow switching cities and update dashboard content', async ({ page }) => {
    // Initial check for London content
    await expect(page.getByText(/Hot Pizza in London/i)).toBeVisible();

    // Switch city to New York
    await page.getByLabel('City Selection').selectOption('new-york');

    // Verify content updates for New York
    await expect(page.getByText(/Hot Pizza in New York/i)).toBeVisible();
    await expect(page.getByText(/Trending New Restaurant in New York/i)).toBeVisible();
  });

  test('should allow updating ad preferences', async ({ page }) => {
    // Navigate to preferences page (assuming a direct link or navigation)
    await page.goto('/preferences'); // Adjust if the navigation is different
    await expect(page.getByText('Ad Preferences')).toBeVisible();

    // Change ad frequency
    await page.getByLabel('Ad Frequency:').selectOption('low');

    // Exclude a category
    await page.getByLabel('Shopping').check();

    // Save preferences
    await page.getByRole('button', { name: /Save Preferences/i }).click();

    // Verify success message
    await expect(page.getByText('Preferences updated successfully!')).toBeVisible();

    // Re-navigate to check if changes persisted (optional, but good for robustness)
    await page.reload();
    await expect(page.getByLabel('Ad Frequency:')).toHaveValue('low');
    await expect(page.getByLabelText('Shopping')).toBeChecked();
  });
});
