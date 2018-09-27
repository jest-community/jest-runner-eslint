module.exports = {
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects',
    './watch-fix',
  ],
  projects: [
    {
      displayName: 'e2e',
      testPathIgnorePatterns: [
        '/examples/',
        '/node_modules/',
        '/__eslint__/',
        '/__fixtures__/',
      ],
      testMatch: [
        '<rootDir>/integrationTests/*.test.js',
        '<rootDir>/integrationTests/**/*.test.js',
      ],
    },
    {
      displayName: 'tests',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.js'],
    },
    {
      displayName: 'lint',
      runner: './',
      testPathIgnorePatterns: [
        '/examples/',
        '/node_modules/',
        '/__eslint__/',
        '/__fixtures__/',
      ],
      testMatch: [
        '<rootDir>/src/*.js',
        '<rootDir>/src/**/*.js',
        '<rootDir>/integrationTests/*.js',
        '<rootDir>/integrationTests/**/*.js',
      ],
    },
  ],
};
