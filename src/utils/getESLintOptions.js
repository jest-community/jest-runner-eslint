const { cosmiconfigSync } = require('cosmiconfig');
const normalizeConfig = require('./normalizeConfig');

const explorer = cosmiconfigSync('jest-runner-eslint');

const getESLintOptions = config => {
  const result = explorer.search(config.rootDir);

  if (result) {
    return normalizeConfig(result.config);
  }

  return normalizeConfig({});
};

module.exports = getESLintOptions;
