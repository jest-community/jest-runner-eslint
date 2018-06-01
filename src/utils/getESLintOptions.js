const normalizeConfig = require('./normalizeConfig');
const cosmiconfig = require('cosmiconfig');

const explorer = cosmiconfig('jest-runner-eslint', { sync: true });

const getESLintOptions = (config, overrides = {}) => {
  const result = explorer.load(config.rootDir);

  if (result) {
    const cliOptions = Object.assign(
      {},
      result.config.cliOptions || {},
      overrides.cliOptions || {},
    );

    return normalizeConfig(
      Object.assign({}, result.config, {
        cliOptions,
      }),
    );
  }

  return normalizeConfig(overrides);
};

module.exports = getESLintOptions;
