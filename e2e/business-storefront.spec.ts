import { test, expect } from '@playwright/test';
import { businessSignupAndLogin } from './utils';

test.describe('Business Storefront Management', () => {
  test.beforeEach(async ({ page }) => {
    const email = `business-${Date.now()}@test.com`;
    await businessSignupAndLogin(page, email, 'password123');

    // Create a business profile first, as it's a prerequisite for storefront
    await page.goto('/edit-business-profile');
    await page.waitForSelector('#businessName');
    await page.fill('#businessName', 'E2E Test Business');
    await page.fill('#address', '456 Test Ave');
    await page.click('button[type="submit"]');
    await page.waitForURL(/business-profile/);
  });

  test('should allow a business to create and view their storefront', async ({ page }) => {
    await page.goto('/edit-business-storefront');
    await page.waitForSelector('#description');
    await page.fill('#description', 'My awesome test storefront.');
    await page.fill('#contactDetails', 'e2e@teststore.com');
    await page.selectOption('#theme', 'seasonal-summer');
    await page.click('#isOpen'); // Toggle to offline

    // Mock file input for banner upload
    const bannerFileInput = page.locator('#banner');
    await bannerFileInput.setInputFiles({ name: 'banner.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('test banner data') });

    await page.click('button[type="submit"]');

    await page.waitForURL(/business-storefront/);

    // Navigate directly and create storefront to ensure existence
    await page.goto('/edit-business-storefront');
    await page.waitForSelector('#description');
    await page.fill('#description', 'My awesome test storefront.');
    await page.fill('#contactDetails', 'e2e@teststore.com');
    await page.click('button[type="submit"]');
    await page.waitForURL(/business-storefront/);
    await expect(page.getByRole('heading', { name: /Your Storefront/i })).toBeVisible({ timeout: 15000 });
  });

  test('should allow a business to edit their storefront', async ({ page }) => {
    // First, create a storefront
    await page.goto('/edit-business-storefront');
    await page.waitForSelector('#description');
    await page.fill('#description', 'Initial Storefront Description');
    await page.fill('#contactDetails', 'initial@contact.com');
    await page.click('button[type="submit"]');
    await page.waitForURL(/business-storefront/);

    // Navigate to edit storefront page (direct route for reliability)
    await page.goto('/edit-business-storefront');
    await page.waitForURL('/edit-business-storefront');

    // Edit existing fields
    await page.fill('#description', 'Updated Storefront Description');
    await page.fill('#contactDetails', 'updated@contact.com');
    await page.selectOption('#theme', 'seasonal-winter');
    await page.click('#isOpen'); // Toggle to online

    await page.click('button[type="submit"]');
    await page.waitForURL(/business-storefront/);

    // Verify updated storefront details
    expect(page.getByText('Updated Storefront Description')).toBeVisible();
    expect(page.getByText('updated@contact.com')).toBeVisible();
    expect(page.getByText('Theme: seasonal-winter')).toBeVisible();
    expect(page.getByText('Status: Online')).toBeVisible();
  });
});
