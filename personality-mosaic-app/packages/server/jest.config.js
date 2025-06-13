/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src', // Points Jest to the src directory for tests and source files
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testRegex: '.*\\.spec\\.ts$', // Looks for files like user.spec.ts or auth.service.spec.ts
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: '../tsconfig.json', // Point to the server's tsconfig for consistency
    }],
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/index.ts', // Usually, index files just export, so no need to cover
    '!**/*.interface.ts', // No logic in interfaces
    '!**/*.dto.ts', // Data Transfer Objects usually have no logic
    '!**/*.module.ts', // Module definition files
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageDirectory: '../coverage', // Coverage reports will be in packages/server/coverage
  coverageReporters: ['text', 'lcov', 'json-summary'], // Common reporters
  verbose: true, // Output more information during tests
  setupFilesAfterEnv: ['../jest.setup.js'], // Optional: for global test setup
};
