import { test, expect } from '@playwright/test';
import { signupAndCompleteOnboarding } from './utils';

test.describe('User Onboarding Flow', () => {
  test('should allow a new user to complete onboarding and view profile details', async ({ page }) => {
    const userEmail = `onboarding_test${Date.now()}@example.com`;
    const userPassword = 'password123';
    await signupAndCompleteOnboarding(page, userEmail, userPassword);
    await expect(page).toHaveURL(/dashboard/);
  });
});
