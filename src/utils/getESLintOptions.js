const normalizeConfig = require('./normalizeConfig');
const cosmiconfig = require('cosmiconfig');

const explorer = cosmiconfig('jest-runner-eslint', { sync: true });

const getESLintOptions = config => {
  const result = explorer.load(config.rootDir);

  if (result) {
    return normalizeConfig(result.config);
  }

  return normalizeConfig({});
};

module.exports = getESLintOptions;
