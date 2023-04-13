import { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    testTimeout: 10000,
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage_e2e_tests',
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testEnvironment: 'node',
    testRegex: '.e2e-spec.ts$',
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

