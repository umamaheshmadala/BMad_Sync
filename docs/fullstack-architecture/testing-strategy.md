# Testing Strategy
Testing Pyramid
Plaintext

           E2E Tests
          /         \
    Integration Tests
    /             \
Frontend Unit  Backend Unit
Test Organization
Frontend Tests:

Unit tests: apps/web/src/components/**/*.test.ts(x)

Integration tests: apps/web/src/features/**/*.test.ts(x) (testing interaction of multiple components/modules)

Backend Tests:

Unit tests: apps/api/src/services/**/*.test.ts

Integration tests: apps/api/src/controllers/**/*.test.ts (testing API endpoints with mocked external dependencies)

E2E Tests: e2e/tests/**/*.spec.ts

Test Examples
Frontend Component Test (React Testing Library/Jest):

TypeScript

// apps/web/src/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText(/click me/i)).toBeInTheDocument();
});
Backend API Test (Jest/Supertest for Netlify Function):

TypeScript

// apps/api/src/controllers/auth.test.ts
import request from 'supertest';
// Assume app is your Netlify function handler for testing
import { handler as authHandler } from '../functions/auth'; 

describe('POST /api/auth/signup', () => {
  it('should return 200 OK for successful signup', async () => {
    const response = await request(authHandler)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user_id');
  });
});
E2E Test (Playwright):

TypeScript

// e2e/tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up and login', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="email"]', 'e2e@example.com');
  await page.fill('input[name="password"]', 'e2ePassword');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/onboarding/profile');

  // Continue to login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'e2e@example.com');
  await page.fill('input[name="password"]', 'e2ePassword');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});