const { cosmiconfigSync } = require('cosmiconfig');
const normalizeConfig = require('./normalizeConfig');

const explorer = cosmiconfigSync('jest-runner-eslint');

const getESLintOptions = (configType, config) => {
  const result = explorer.search(config.rootDir);

  if (result) {
    return normalizeConfig(configType, result.config);
  }

  return normalizeConfig(configType, {});
};

module.exports = getESLintOptions;
