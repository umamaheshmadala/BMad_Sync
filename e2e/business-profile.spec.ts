import { test, expect } from '@playwright/test';

test.describe('Business Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean state before each test
    await page.goto('/business-signup');
    await page.fill('input[name="email"]', `business-${Date.now()}@test.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/business-profile'); // Assuming successful signup redirects here
  });

  test('should allow a business to create and view their profile', async ({ page }) => {
    await page.goto('/edit-business-profile');

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

    await page.waitForURL('/business-profile');

    // Verify profile details are displayed on the viewing page
    expect(page.getByText('My Test Business')).toBeVisible();
    expect(page.getByText('123 Main St, Anytown')).toBeVisible();
    expect(page.getByRole('link', { name: 'Link' })).toHaveAttribute('href', 'https://maps.google.com/?q=My+Test+Business');
    expect(page.getByText('contact@testbusiness.com')).toBeVisible();
    expect(page.getByText('9:00 AM')).toBeVisible();
    expect(page.getByText('5:00 PM')).toBeVisible();
    expect(page.getByText('Christmas')).toBeVisible();

    // Check if the logo is displayed (this might require more sophisticated checks for actual image loading)
    const logoImage = page.locator('img[alt="Business Logo"]');
    await expect(logoImage).toBeVisible();
  });

  test('should allow a business to edit their profile', async ({ page }) => {
    // First, create a profile (reusing the creation logic or setting up directly in DB)
    await page.goto('/edit-business-profile');
    await page.fill('#businessName', 'Initial Business Name');
    await page.fill('#address', 'Initial Address');
    await page.click('button[type="submit"]');
    await page.waitForURL('/business-profile');

    // Navigate to edit profile page
    await page.click('button:has-text("Edit Profile")');
    await page.waitForURL('/edit-business-profile');

    // Edit existing fields
    await page.fill('#businessName', 'Updated Business Name');
    await page.fill('#address', 'Updated Address');
    await page.click('button[type="submit"]');
    await page.waitForURL('/business-profile');

    // Verify updated profile details
    expect(page.getByText('Updated Business Name')).toBeVisible();
    expect(page.getByText('Updated Address')).toBeVisible();
  });
});
