module.exports = {
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  projects: [
    {
      displayName: 'e2e',
      testPathIgnorePatterns: ['/examples/', '/node_modules/', '/__eslint__/'],
      testMatch: [
        '<rootDir>/integrationTests/*.test.js',
        '<rootDir>/integrationTests/**/*.test.js',
      ],
    },
    {
      displayName: 'tests',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.js'],
    },
  ],
};
