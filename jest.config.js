module.exports = {
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  testPathIgnorePatterns: ['/examples/', '/node_modules/', '/__eslint__/'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/integrationTests/*.test.js',
    '<rootDir>/integrationTests/**/*.test.js',
  ],
};
