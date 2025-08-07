import { test, expect } from '@playwright/test';

test.describe('Business Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-login'); // Navigate to business login page
  });

  test('should allow a business user to sign up successfully', async ({ page }) => {
    await page.goto('/business-signup'); // Navigate to business signup page
    await page.fill('input[type="email"]', `business-signup-${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'businesspassword123');
    await page.getByRole('button', { name: /Sign Up/i }).click();

    // Expect to be redirected to business login page after successful signup
    await expect(page).toHaveURL(/business-login/); 
    await expect(page.getByText('Login to Your Business Account')).toBeVisible(); 
  });

  test('should show error for existing business user during signup', async ({ page }) => {
    // First, sign up a business user to ensure one exists
    const email = `existing-business-user-${Date.now()}@example.com`;
    await page.goto('/business-signup');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'businesspassword123');
    await page.getByRole('button', { name: /Sign Up/i }).click();
    await expect(page).toHaveURL(/business-login/);

    // Now, try to sign up with the same business user
    await page.goto('/business-signup');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'businesspassword123');
    await page.getByRole('button', { name: /Sign Up/i }).click();

    // Expect to see an error message for existing user
    await expect(page.getByText('This email is already registered. Please try logging in with your business account.')).toBeVisible();
    await expect(page).toHaveURL(/business-signup/); // Should remain on signup page
  });

  test('should allow a business user to log in successfully', async ({ page }) => {
    // Assuming a business user 'business@example.com' with password 'businesspassword123' exists in your Supabase DB for testing
    await page.fill('input[type="email"]', 'business@example.com');
    await page.fill('input[type="password"]', 'businesspassword123');
    await page.getByRole('button', { name: /Sign in/i }).click();

    // Expect to be redirected to the business dashboard after successful login
    await expect(page).toHaveURL(/business-dashboard/); 
    await expect(page.getByText('Business Dashboard (Protected)')).toBeVisible(); 
  });

  test('should show error for invalid business login credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid-business@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.getByRole('button', { name: /Sign in/i }).click();

    // Expect to see an error message for invalid credentials
    await expect(page.getByText('Invalid email or password for business account. Please try again.')).toBeVisible();
    await expect(page).toHaveURL(/business-login/); // Should remain on login page
  });
});
