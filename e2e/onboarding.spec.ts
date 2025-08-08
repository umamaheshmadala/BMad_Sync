import { test, expect } from '@playwright/test';

test.describe('User Onboarding Flow', () => {
  test('should allow a new user to complete onboarding and view profile details', async ({ page }) => {
    // 1. Navigate to the signup page
    await page.goto('http://localhost:5173/signup');

    // 2. Sign up a new user
    const userEmail = `onboarding_test${Date.now()}@example.com`;
    const userPassword = 'password123';

    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.click('button[type="submit"]');

    // 3. Assert that the user is redirected to the onboarding page
    await page.waitForURL('http://localhost:5173/');
    await expect(page.getByRole('heading', { name: /Welcome! Tell us about yourself./i })).toBeVisible();

    // 4. Fill in the city and select at least 5 interests
    await page.selectOption('select[name="city"]', 'New York');
    const interestsToSelect = ['Technology', 'Sports', 'Music', 'Movies', 'Books'];
    for (const interest of interestsToSelect) {
      await page.check(`input[type="checkbox"][value="${interest}"]`);
    }

    // 5. Submit the onboarding form
    await page.click('button[type="submit"]');

    // 6. Assert that the user is redirected to the home page
    await page.waitForURL('http://localhost:5173/');
    await expect(page.getByRole('heading', { name: /Welcome!/i })).toBeVisible();

    // 7. Navigate to the profile page
    await page.goto('http://localhost:5173/profile');

    // 8. Assert that the selected city and interests are displayed on the profile page
    await expect(page.getByText(/City: New York/i)).toBeVisible();
    await expect(page.getByText(/Interests: Technology, Sports, Music, Movies, Books/i)).toBeVisible();

    // Navigate to edit city and interests page
    await page.click('text=Edit City & Interests');
    await page.waitForURL('http://localhost:5173/edit-profile/city-interests');

    // Update city and interests
    await page.selectOption('select[name="city"]', 'Los Angeles');
    await page.uncheck('input[type="checkbox"][value="Technology"]');
    await page.check('input[type="checkbox"][value="Gaming"]');

    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:5173/profile');

    // Verify updated details
    await expect(page.getByText(/City: Los Angeles/i)).toBeVisible();
    await expect(page.getByText(/Interests: Sports, Music, Movies, Books, Gaming/i)).toBeVisible();

  });
});
