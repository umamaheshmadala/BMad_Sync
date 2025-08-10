import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          resolveJsonModule: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@deno/http$': '<rootDir>/src/__mocks__/@deno/http.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*)',
  ],
};

export default config;


