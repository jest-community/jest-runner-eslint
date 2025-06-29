module.exports = {
  runner: require.resolve('../../../'),
  testMatch: ['**/__eslint__/**/*.js'],
  reporters: ['github-actions'],
};
