const cosmiconfig = require('cosmiconfig');
const normalizeConfig = require('./normalizeConfig');

const explorer = cosmiconfig('jest-runner-eslint');

const getESLintOptions = config => {
  const result = explorer.searchSync(config.rootDir);

  if (result) {
    return normalizeConfig(result.config);
  }

  return normalizeConfig({});
};

module.exports = getESLintOptions;
