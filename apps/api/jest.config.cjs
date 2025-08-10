/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          resolveJsonModule: true,
        },
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    '^@deno/http$': '<rootDir>/src/__mocks__/@deno/http.ts',
    '^https://deno.land/std@0.170.0/testing/asserts.ts$': '<rootDir>/src/__mocks__/deno_std/asserts.ts',
    '^https://deno.land/std@0.177.0/testing/asserts.ts$': '<rootDir>/src/__mocks__/deno_std/asserts.ts',
    '^https://deno.land/std/assert/mod.ts$': '<rootDir>/src/__mocks__/deno_std/asserts.ts',
    '^https://deno.land/std/mock/mod.ts$': '<rootDir>/src/__mocks__/deno_std/mock.ts',
    '^https://esm.sh/@supabase/supabase-js@2(?:\\.\\d+\\.\\d+)?$': '<rootDir>/src/__mocks__/@supabase/supabase-js.ts',
    '^https://esm.sh/@supabase/supabase-js@2$': '<rootDir>/src/__mocks__/@supabase/supabase-js.ts',
    '^https?://esm\\.sh/@supabase/supabase-js@.*$': '<rootDir>/src/__mocks__/@supabase/supabase-js.ts',
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/user/tests/favorites.test.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};


