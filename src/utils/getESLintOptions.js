const normalizeOptions = require('./normalizeOptions');
const cosmiconfig = require('cosmiconfig');

const explorer = cosmiconfig('jest-runner-eslint', { sync: true });

const getESLintOptions = config => {
  const result = explorer.load(config.rootDir);
  if (result) {
    return normalizeOptions(result.config);
  }

  return {};
};

module.exports = getESLintOptions;
