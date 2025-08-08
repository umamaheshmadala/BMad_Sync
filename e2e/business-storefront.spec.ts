import { test, expect } from '@playwright/test';

test.describe('Business Storefront Management', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean state before each test
    await page.goto('/business-signup');
    await page.fill('input[name="email"]', `business-${Date.now()}@test.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/business-profile'); // Assuming successful signup redirects here

    // Create a business profile first, as it's a prerequisite for storefront
    await page.goto('/edit-business-profile');
    await page.fill('#businessName', 'E2E Test Business');
    await page.fill('#address', '456 Test Ave');
    await page.click('button[type="submit"]');
    await page.waitForURL('/business-profile');
  });

  test('should allow a business to create and view their storefront', async ({ page }) => {
    await page.goto('/edit-business-storefront');

    await page.fill('#description', 'My awesome test storefront.');
    await page.fill('#contactDetails', 'e2e@teststore.com');
    await page.selectOption('#theme', 'seasonal-summer');
    await page.click('#isOpen'); // Toggle to offline

    // Mock file input for banner upload
    const bannerFileInput = page.locator('#banner');
    await bannerFileInput.setInputFiles({ name: 'banner.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('test banner data') });

    await page.click('button[type="submit"]');

    await page.waitForURL('/business-storefront');

    // Verify storefront details are displayed on the viewing page
    expect(page.getByText('My awesome test storefront.')).toBeVisible();
    expect(page.getByText('e2e@teststore.com')).toBeVisible();
    expect(page.getByText('Theme: seasonal-summer')).toBeVisible();
    expect(page.getByText('Status: Offline')).toBeVisible();

    const bannerImage = page.locator('img[alt="Promotional Banner"]');
    await expect(bannerImage).toBeVisible();
  });

  test('should allow a business to edit their storefront', async ({ page }) => {
    // First, create a storefront
    await page.goto('/edit-business-storefront');
    await page.fill('#description', 'Initial Storefront Description');
    await page.fill('#contactDetails', 'initial@contact.com');
    await page.click('button[type="submit"]');
    await page.waitForURL('/business-storefront');

    // Navigate to edit storefront page
    await page.click('button:has-text("Edit Storefront")');
    await page.waitForURL('/edit-business-storefront');

    // Edit existing fields
    await page.fill('#description', 'Updated Storefront Description');
    await page.fill('#contactDetails', 'updated@contact.com');
    await page.selectOption('#theme', 'seasonal-winter');
    await page.click('#isOpen'); // Toggle to online

    await page.click('button[type="submit"]');
    await page.waitForURL('/business-storefront');

    // Verify updated storefront details
    expect(page.getByText('Updated Storefront Description')).toBeVisible();
    expect(page.getByText('updated@contact.com')).toBeVisible();
    expect(page.getByText('Theme: seasonal-winter')).toBeVisible();
    expect(page.getByText('Status: Online')).toBeVisible();
  });
});
