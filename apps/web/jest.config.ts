import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^../lib/supabaseClient$': '<rootDir>/src/__mocks__/supabaseClient.ts',
    '^./lib/supabaseClient$': '<rootDir>/src/__mocks__/supabaseClient.ts',
    '^src/lib/supabaseClient$': '<rootDir>/src/__mocks__/supabaseClient.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!react-router-dom|@supabase)',
  ],
};

export default config;