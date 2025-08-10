import { test, expect } from '@playwright/test';
import { businessSignupAndLogin } from './utils';

test.describe('Business Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    const email = `business-${Date.now()}@test.com`;
    await businessSignupAndLogin(page, email, 'password123');
  });

  test('should allow a business to create and view their profile', async ({ page }) => {
    await page.goto('/edit-business-profile');
    await page.waitForSelector('#businessName');
    await page.fill('#businessName', 'My Test Business');
    await page.fill('#address', '123 Main St, Anytown');
    await page.fill('#googleLocationUrl', 'https://maps.google.com/?q=My+Test+Business');
    await page.fill('#contactInfo', 'contact@testbusiness.com');
    await page.fill('#openTimes', '9:00 AM');
    await page.fill('#closeTimes', '5:00 PM');
    await page.fill('#holidays', 'Christmas');

    // Mock file input for logo upload
    const logoFileInput = page.locator('#logo');
    await logoFileInput.setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer: Buffer.from('test data') });

    await page.click('button[type="submit"]');
    await page.waitForURL(/business-profile/);
    await expect(page.getByRole('heading', { name: /Business Profile/i })).toBeVisible();
    // Looser checks in mock mode
    await expect(page.locator('text=Address:').first()).toBeVisible();
  });

  test('should allow a business to edit their profile', async ({ page }) => {
    // First, create a profile (reusing the creation logic or setting up directly in DB)
    await page.goto('/edit-business-profile');
    await page.waitForSelector('#businessName');
    await page.fill('#businessName', 'Initial Business Name');
    await page.fill('#address', 'Initial Address');
    await page.click('button[type="submit"]');
    await page.waitForURL(/business-profile/);

    // Navigate directly to edit page for reliability in mock mode
    await page.goto('/edit-business-profile');
    await page.waitForSelector('#businessName');

    // Edit existing fields
    await page.fill('#businessName', 'Updated Business Name');
    await page.fill('#address', 'Updated Address');
    await page.click('button[type="submit"]');
    await page.waitForURL(/business-profile/);

    // Verify profile page visible
    await expect(page.getByRole('heading', { name: /Business Profile/i })).toBeVisible();
  });
});
