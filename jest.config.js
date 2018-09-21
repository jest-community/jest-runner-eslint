module.exports = {
  watchPlugins: ['jest-watch-select-projects', './watch'],
  projects: [
    {
      displayName: 'lint',
      runner: './',
      testPathIgnorePatterns: [
        '/examples/',
        '/node_modules/',
        '/__eslint__/',
        '/__fixtures__/',
      ],
      testMatch: ['<rootDir>/(src|integrationTests)/**/*.js'],
    },
    {
      displayName: 'tests',
      testPathIgnorePatterns: ['/examples/', '/node_modules/', '/__eslint__/'],
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.js',
        '<rootDir>/integrationTests/*.test.js',
        '<rootDir>/integrationTests/**/*.test.js',
      ],
    },
  ],
};
