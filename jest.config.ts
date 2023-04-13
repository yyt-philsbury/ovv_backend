import { Config } from 'jest';
/**
 * Configuration file for unit tests. Jest looks for this file name by default.
 */
export default async (): Promise<Config> => {
  return {
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage_unit_tests',
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    setupFiles: ['dotenv/config'],
    testPathIgnorePatterns: [
      'node_modules',
      'dist',
      'prisma',
      'patches',
      'seed',
      'documentation',
    ],
  };
};

