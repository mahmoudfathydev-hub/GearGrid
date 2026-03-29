const nextJest = require('next/jest')({
  dir: ['src', 'tests'],
  testMatchPatterns: [
    '**/__tests__/**/*',
    '**/?(*)\\.(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'tsx'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
});

module.exports = nextJest;
