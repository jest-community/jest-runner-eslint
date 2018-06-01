const { createJestRunner } = require('create-jest-runner');
const { getConfigOverrides } = require('../utils/configOverrides');

const runner = createJestRunner(require.resolve('./runESLint'), {
  getExtraOptions: () => {
    return { configOverrides: getConfigOverrides() };
  },
});

module.exports = runner;
