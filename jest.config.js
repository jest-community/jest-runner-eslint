module.exports = {
  testPathIgnorePatterns: ['/examples/', '/node_modules/', '/__eslint__/'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/integrationTests/*.test.js',
    '<rootDir>/integrationTests/**/*.test.js',
  ],
};
