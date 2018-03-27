const { createJestRunner } = require('create-jest-runner');

const runner = createJestRunner(require.resolve('./runESLint'));

module.exports = runner;
