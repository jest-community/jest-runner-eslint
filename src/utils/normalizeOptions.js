const mapKeys = require('lodash/fp/mapKeys');
const flow = require('lodash/fp/flow');
const omit = require('lodash/fp/omit');
/**
 * This base config maps to the default values of the CLI options that have a corresponding `--cli-option`
 * https://eslint.org/docs/developer-guide/nodejs-api#cliengine
 */

const baseConfig = {
  allowInlineConfig: true,
  cache: false,
  cacheLocation: '.eslintcache',
  configFile: null,
  envs: [],
  extensions: ['.js'],
  fix: false,
  globals: [],
  ignore: true,
  ignorePath: null,
  parser: 'espree',
  parserOptions: {},
  plugins: [],
  rulePaths: [],
  rules: null,
  useEslintrc: true,
};

const oneToOneKeyMap = {
  cacheLocation: 'cacheLocation',
  config: 'configFile',
  fix: 'fix',
  ignorePath: 'ignorePath',
  parser: 'parser',
  parserOptions: 'parserOptions',
};

const mapOneToOneKeys = flow(
  mapKeys(key => oneToOneKeyMap[key]),
  omit(undefined),
);

const normalizeOptions = rawConfig => {
  const config = Object.assign({}, baseConfig, mapOneToOneKeys(rawConfig));

  if (rawConfig.noInlineConfig) {
    config.allowInlineConfig = !rawConfig.noInlineConfig;
  }

  if (rawConfig.noIgnore) {
    config.ignore = !rawConfig.noIgnore;
  }

  if (rawConfig.noEslintrc) {
    config.useEslintrc = !rawConfig.noEslintrc;
  }

  if (rawConfig.ext) {
    config.extensions =
      typeof rawConfig.ext === 'string' ? [rawConfig.ext] : rawConfig.ext;
  }

  if (rawConfig.env) {
    config.envs =
      typeof rawConfig.env === 'string' ? [rawConfig.env] : rawConfig.env;
  }

  if (rawConfig.global) {
    config.globals =
      typeof rawConfig.global === 'string'
        ? [rawConfig.global]
        : rawConfig.global;
  }

  if (rawConfig.plugin) {
    config.plugins =
      typeof rawConfig.plugin === 'string'
        ? [rawConfig.plugin]
        : rawConfig.plugin;
  }

  if (rawConfig.rulesdir) {
    config.rulePaths =
      typeof rawConfig.rulesdir === 'string'
        ? [rawConfig.rulesdir]
        : rawConfig.rulesdir;
  }

  if (rawConfig.rule) {
    config.rules =
      typeof rawConfig.rule === 'string' ? [rawConfig.rule] : rawConfig.rule;
  }

  return config;
};
module.exports = normalizeOptions;
