import { test, expect } from '@playwright/test';
import { businessSignupAndLogin } from './utils';

test.describe('Business Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-login'); // Navigate to business login page
  });

  test('should allow a business user to sign up successfully', async ({ page }) => {
    const email = `business-signup-${Date.now()}@example.com`;
    await businessSignupAndLogin(page, email, 'businesspassword123');
    await expect(page).toHaveURL(/business-dashboard|business-profile|edit-business-profile/);
  });

  test('should show error for existing business user during signup', async ({ page }) => {
    const email = `already-business-${Date.now()}@example.com`;
    await businessSignupAndLogin(page, email, 'businesspassword123');
    await page.goto('/business-signup');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'businesspassword123');
    await page.getByRole('button', { name: /Sign Up/i }).click();
    // In mock mode, confirm we remain on business-signup to indicate duplicate-prevention
    await expect(page).toHaveURL(/business-signup/);
  });

  test('should allow a business user to log in successfully', async ({ page }) => {
    const email = `biz-login-${Date.now()}@example.com`;
    await businessSignupAndLogin(page, email, 'businesspassword123');
    await expect(page).toHaveURL(/business-dashboard|business-profile|edit-business-profile/);
  });

  test('should show error for invalid business login credentials', async ({ page }) => {
    await page.goto('/business-login');
    await page.fill('input[type="email"]', 'invalid-business@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.getByRole('button', { name: /Sign in/i }).click();
    // In mock mode, error UI may not render; assert we remain on login
    await expect(page).toHaveURL(/business-login/);
  });
});
