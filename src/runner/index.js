const { createJestRunner } = require('create-jest-runner');
const configOverrides = require('../utils/configOverrides');

const runner = createJestRunner(require.resolve('./runESLint'), {
  getExtraOptions: () => ({ fix: configOverrides.getFix() }),
});

module.exports = runner;
