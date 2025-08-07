import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); // Assuming /login is the initial auth page
  });

  test('should allow a user to sign up successfully', async ({ page }) => {
    await page.goto('/signup'); // Navigate to signup page
    await page.fill('input[type="email"]', `test-signup-${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /Sign Up/i }).click();

    // Expect to be redirected to a protected route or dashboard after successful signup
    await expect(page).toHaveURL(/dashboard/); // Adjust to your actual dashboard URL or protected route
    await expect(page.getByText('Welcome!')).toBeVisible(); // Or any element indicating successful login
  });

  test('should show error for existing user during signup', async ({ page }) => {
    // First, sign up a user to ensure one exists
    const email = `existing-user-${Date.now()}@example.com`;
    await page.goto('/signup');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /Sign Up/i }).click();
    await expect(page).toHaveURL(/dashboard/);

    // Now, try to sign up with the same user
    await page.goto('/signup');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /Sign Up/i }).click();

    // Expect to see an error message for existing user
    await expect(page.getByText('This email is already registered. Please try logging in.')).toBeVisible();
    await expect(page).toHaveURL(/signup/); // Should remain on signup page
  });

  test('should allow a user to log in successfully', async ({ page }) => {
    // Assuming a user 'test@example.com' with password 'password123' exists in your Supabase DB for testing
    // In a real scenario, you might create this user via API before running tests or use seed data
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /Sign in$/i }).click();

    // Expect to be redirected to a protected route or dashboard after successful login
    await expect(page).toHaveURL(/dashboard/); // Adjust to your actual dashboard URL or protected route
    await expect(page.getByText('Welcome!')).toBeVisible(); // Or any element indicating successful login
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.getByRole('button', { name: /Sign in$/i }).click();

    // Expect to see an error message for invalid credentials
    await expect(page.getByText('Invalid email or password. Please try again.')).toBeVisible();
    await expect(page).toHaveURL(/login/); // Should remain on login page
  });

  test('should initiate Google login', async ({ page }) => {
    // Click the Google Sign-in button
    await page.getByRole('button', { name: /Sign in with Google/i }).click();

    // Expect to be redirected to Google's OAuth consent screen or a relevant URL
    // Note: Fully automated testing of the Google OAuth flow (entering credentials in Google's page) is complex and often out of scope for typical E2E tests.
    // This test primarily checks if the redirection to Google's domain is initiated.
    await expect(page).toHaveURL(/^https:\/\/accounts\.google\.com\/.*/, { timeout: 10000 }); // Adjust timeout if needed
  });

  test('should allow a user to logout', async ({ page }) => {
    // First, log in a user
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /Sign in$/i }).click();
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Welcome!')).toBeVisible();

    // Now, click the logout button (adjust selector as per your App.tsx)
    await page.getByRole('button', { name: /Logout/i }).click(); // Assuming there's a logout button visible after login

    // Expect to be redirected to the login page or a public home page
    await expect(page).toHaveURL(/login/); // Adjust to your actual login or public home URL
    await expect(page.getByText('Sign In')).toBeVisible(); // Or any element indicating logged out state
  });
});