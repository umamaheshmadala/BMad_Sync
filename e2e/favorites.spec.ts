import { test, expect } from '@playwright/test';

test.describe('Favorites Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Stub favorites GET to start empty
    await page.route('**/api/user/favorites?**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ businesses: [], coupons: [] }),
      });
    });

    // Stub favorite coupon POST
    await page.route('**/api/user/favorites/coupon?**', async (route) => {
      if ((await route.request()).method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Coupon favorited' }),
        });
        return;
      }
      // Default continue for other methods
      await route.continue();
    });

    // Stub Supabase password grant and user endpoints so login succeeds
    await page.route('**/auth/v1/token**', async (route) => {
      const req = route.request();
      if (req.method() === 'POST' && req.url().includes('grant_type=password')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'test-access',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'test-refresh',
            user: { id: 'test-user-id', email: 'test@example.com', aud: 'authenticated', role: 'authenticated' },
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/auth/v1/user**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'test-user-id', email: 'test@example.com', aud: 'authenticated', role: 'authenticated' }),
      });
    });

    // Stub Supabase PostgREST calls to users table so onboarding is complete
    await page.route('**/rest/v1/users**', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        // Return a single row with onboarding complete
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          // PostgREST returns array or object depending on params; our code uses .single()
          body: JSON.stringify({ user_id: 'test-user-id', email: 'test@example.com', onboarding_complete: true }),
        });
        return;
      }
      if (method === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({}) });
        return;
      }
      await route.continue();
    });

    // Login as an existing test user
    await page.goto('/');
    // In mock mode, set synthetic session so navbar appears
    await page.evaluate(() => { (window as any).__E2E_SESSION__ = { user: { id: 'test-user-id', email: 'test@example.com' } }; localStorage.setItem('e2e-session', JSON.stringify((window as any).__E2E_SESSION__)); });
    await page.reload();
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /Welcome to your Dashboard!/i })).toBeVisible({ timeout: 15000 });
  });

  test('user can favorite a coupon from dashboard', async ({ page }) => {
    await expect(page.getByText(/Hot Coupon Offers/i)).toBeVisible();

    const favoriteBtn = page.getByRole('button', { name: /^Favorite$/ });
    await expect(favoriteBtn.first()).toBeVisible();
    await favoriteBtn.first().click();

    // Button should toggle to Unfavorite
    await expect(page.getByRole('button', { name: /^Unfavorite$/ }).first()).toBeVisible();
  });
});


