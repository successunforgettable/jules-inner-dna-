// jest.setup.js
// This file is run before each test file.
// Use this for global test setup, like:
// - Setting up global mocks (e.g., for database connections, external services)
// - Initializing environment variables specific to the test environment
// - Any other global configurations needed for Jest tests

// Example: Mocking environment variables
// process.env.SOME_TEST_VARIABLE = 'test_value';

// Example: Global mocks (if you were using a logger library)
// jest.mock('./src/utils/logger', () => ({
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
//   debug: jest.fn(),
// }));

// Ensure console logs during tests are clean or managed if needed
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
// };

// Add any other global setup here.
// If no global setup is needed, this file can be empty or removed from jest.config.js.

beforeAll(() => {
  // Runs once before all tests in a file
});

afterAll(() => {
  // Runs once after all tests in a file
});

beforeEach(() => {
  // Runs before each test
});

afterEach(() => {
  // Runs after each test
  // jest.clearAllMocks(); // Useful if mocks need to be reset between tests
});
