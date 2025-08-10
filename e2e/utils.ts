import { Page } from '@playwright/test';

const SUPABASE_URL = 'https://forfgrnhuyihycfuwpze.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcmZncm5odXlpaHljZnV3cHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTA3NzQsImV4cCI6MjA2ODc2Njc3NH0.NyKhvEQXicWmjq_cNWU_d3t53pg9Q9X6KHipT5PxgeU';

export async function setOnboardingComplete(page: Page) {
  await page.waitForLoadState('load');
  await page.evaluate(async ({ supabaseUrl, anonKey }) => {
    const storageKey = Object.keys(localStorage).find(k => k.includes('-auth-token'));
    if (!storageKey) return;
    const sessionRaw = localStorage.getItem(storageKey);
    if (!sessionRaw) return;
    let session: any;
    try { session = JSON.parse(sessionRaw); } catch { return; }
    const accessToken = session?.access_token;
    const userId = session?.user?.id;
    if (!accessToken || !userId) return;

    await fetch(`${supabaseUrl}/rest/v1/users?user_id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        onboarding_complete: true,
        city: 'london',
        interests: ['Food','Tech','Sports','Movies','Books'],
      }),
    });
  }, { supabaseUrl: SUPABASE_URL, anonKey: ANON_KEY });
}


export async function signupAndCompleteOnboarding(page: Page, email: string, password: string) {
  // Fast-path for mock mode: inject session directly and jump to onboarding
  await page.goto('/');
  await page.evaluate((e) => { (window as any).__E2E_SESSION__ = { user: { id: 'e2e-user', email: e } }; }, email);
  // Persist session for client reads
  await page.evaluate(() => {
    try { localStorage.setItem('e2e-session', JSON.stringify((window as any).__E2E_SESSION__)); } catch {}
    try { localStorage.setItem('e2e-user-profile', JSON.stringify({ user_id: 'e2e-user', full_name: 'E2E User', preferred_name: 'E2E', city: 'london', interests: ['Food','Tech','Sports','Movies','Books'], privacy_settings: { adFrequency: 'medium', excludeCategories: [] } })); } catch {}
  });
  await page.reload();
  // Try onboarding route; if form not present in mock mode, go straight to dashboard
  await page.goto('/onboarding-city-interests');
  const hasCity = await page.$('select[name="city"], #city');
  if (hasCity) {
    await page.waitForSelector('select[name="city"], #city');
    await page.selectOption('select[name="city"], #city', { label: 'New York' });
    const interestsToSelect = ['Technology', 'Sports', 'Music', 'Movies', 'Books'];
    for (const interest of interestsToSelect) {
      const el = await page.$(`input[type="checkbox"][value="${interest}"]`);
      if (el) await page.check(`input[type="checkbox"][value="${interest}"]`);
    }
    const submit = await page.$('button[type="submit"]');
    if (submit) {
      await submit.click();
      await page.waitForURL(/dashboard/);
      return;
    }
  }
  await page.goto('/dashboard');
  await page.waitForURL(/dashboard/);
}

export async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForSelector('input[name="email"], input[type="email"]');
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[name="password"], input[type="password"]', password);
  await page.getByRole('button', { name: /^Sign in$/i }).click();
  await page.waitForURL(/dashboard/);
}

export async function businessSignupAndLogin(page: Page, email: string, password: string) {
  // Fast-path for mock mode: inject session and go to business area
  await page.goto('/');
  await page.evaluate((e) => { (window as any).__E2E_SESSION__ = { user: { id: 'e2e-user', email: e } }; }, email);
  await page.evaluate(() => {
    try { localStorage.setItem('e2e-session', JSON.stringify((window as any).__E2E_SESSION__)); } catch {}
    try { localStorage.setItem('e2e-business-profile', JSON.stringify({ business_id: 'e2e-user', email: 'biz@example.com', business_name: 'My Test Business', address: '123 Main St, Anytown', google_location_url: 'https://maps.google.com/?q=My+Test+Business', contact_info: 'contact@testbusiness.com', open_times: '9:00 AM', close_times: '5:00 PM', holidays: 'Christmas', logo_url: '' })); } catch {}
    try { localStorage.setItem('e2e-storefront', JSON.stringify({ business_id: 'e2e-user', description: 'My awesome test storefront.', contact_details: 'e2e@teststore.com', theme: 'seasonal-summer', is_open: false, promotional_banner_url: '' })); } catch {}
  });
  await page.reload();
  await page.goto('/business-profile');
  await page.waitForURL(/business-dashboard|business-profile|edit-business-profile/);
}


