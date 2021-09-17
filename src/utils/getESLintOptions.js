const { cosmiconfigSync } = require('cosmiconfig');
const normalizeConfig = require('./normalizeConfig');

const explorer = cosmiconfigSync('jest-runner-eslint');

const getESLintOptions = (config, newApi) => {
  const result = explorer.search(config.rootDir);

  if (result) {
    return normalizeConfig(result.config, newApi);
  }

  return normalizeConfig({}, newApi);
};

module.exports = getESLintOptions;
