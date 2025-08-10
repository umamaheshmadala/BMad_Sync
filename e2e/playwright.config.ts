import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    cwd: 'apps/web',
    env: {
      VITE_SUPABASE_URL: 'https://forfgrnhuyihycfuwpze.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcmZncm5odXlpaHljZnV3cHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTA3NzQsImV4cCI6MjA2ODc2Njc3NH0.NyKhvEQXicWmjq_cNWU_d3t53pg9Q9X6KHipT5PxgeU',
      VITE_E2E_MOCK: '1',
    },
  },
});