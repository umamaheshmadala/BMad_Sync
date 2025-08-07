import { test, expect } from '@playwright/test';

test.describe('User Profile Flow', () => {
  test('should allow a user to create and view their profile', async ({ page }) => {
    // 1. Navigate to the signup page (assuming /signup is the path)
    await page.goto('http://localhost:5173/signup');

    // 2. Sign up a new user (reusing logic from auth.spec.ts or similar)
    const userEmail = `test${Date.now()}@example.com`;
    const userPassword = 'password123';

    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.click('button[type="submit"]');

    // Wait for signup to complete and redirect (adjust as per your app's redirect)
    await page.waitForURL('http://localhost:5173/profile'); // Assuming it redirects to profile or edit-profile

    // 3. Navigate to the edit profile page (if not already there)
    await page.goto('http://localhost:5173/edit-profile');

    // 4. Fill in profile details
    await page.fill('input[name="fullName"]', 'E2E Test User');
    await page.fill('input[name="preferredName"]', 'E2E Tester');

    // 5. Upload an avatar (example: creating a dummy file)
    const buffer = Buffer.from('This is a dummy image');
    await page.setInputFiles('input[type="file"]', {
      name: 'test-avatar.png',
      mimeType: 'image/png',
      buffer: buffer,
    });

    // 6. Save the profile
    await page.click('button[type="submit"]');

    // Wait for profile save to complete
    await page.waitForSelector('text=Profile created successfully!'); // Or any success message

    // 7. Navigate to the profile viewing page
    await page.goto('http://localhost:5173/profile');

    // 8. Verify profile details are displayed
    await expect(page.getByRole('heading', { name: /User Profile/i })).toBeVisible();
    await expect(page.getByText(/Full Name: E2E Test User/i)).toBeVisible();
    await expect(page.getByText(/Preferred Name: E2E Tester/i)).toBeVisible();
    await expect(page.getByAltText(/Avatar/i)).toBeVisible();
  });
});
