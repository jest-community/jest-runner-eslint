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
  envs: 'envs',
  exts: 'extensions',
  fix: 'fix',
  globals: 'globals',
  ignorePath: 'ignorePath',
  parser: 'parser',
  parserOptions: 'parserOptions',
  plugins: 'plugins',
  rulesdir: 'rulePaths',
  rules: 'rules',
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

  return config;
};
module.exports = normalizeOptions;
