module.exports = {
  testPathIgnorePatterns: ['/examples/', '/node_modules/', '/__mocha__/'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/integrationTests/*.test.js',
    '<rootDir>/integrationTests/**/*.test.js',
  ],
};
