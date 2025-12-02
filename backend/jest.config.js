module.exports = {
  testEnvironment: 'node',
  // Stop after the first test failure
  bail: 1,
  // Verbose output
  verbose: true,
  // Increase timeout for async tests
  testTimeout: 30000,
  // Ignore setup file from tests
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/setup.js'],
  // Setup dotenv for environment variables
  setupFiles: ['dotenv/config'],
};
