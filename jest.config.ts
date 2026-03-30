import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to the Next.js app to load next.config.js and .env files in the test environment
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Test categories via tags in file naming convention:
  // *.unit.test.ts  -> unit tests (default Jest run)
  // *.smoke.test.ts -> smoke tests
  // *.e2e.test.ts   -> E2E (run with Playwright instead)
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(unit|smoke|integration).test.[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/fonts/**',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageReporters: ['text', 'lcov', 'json-summary'],
};

export default createJestConfig(config);
