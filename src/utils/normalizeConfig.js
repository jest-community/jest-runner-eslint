const dotProp = require('dot-prop');

const identity = v => v;
const negate = v => !v;
const asArray = v => (typeof v === 'string' ? [v] : v);
const asInt = v => {
  if (typeof v === 'number') {
    return v;
  }
  const int = parseInt(v, 10);
  if (Number.isNaN(int)) {
    throw new Error(`'${v}' cannot be converted to a number`);
  }
  return int;
};

const OLD_BASE_CONFIG = {
  cache: {
    default: false,
  },
  cacheLocation: {
    default: '.eslintcache',
  },
  config: {
    name: 'configFile',
    default: null,
  },
  env: {
    name: 'envs',
    default: [],
    transform: asArray,
  },
  ext: {
    name: 'extensions',
    default: ['.js'],
    transform: asArray,
  },
  fix: {
    default: false,
  },
  fixDryRun: {
    default: false,
  },
  format: {
    default: undefined,
  },
  global: {
    name: 'globals',
    default: [],
    transform: asArray,
  },
  ignorePath: {
    default: null,
  },
  ignorePattern: {
    default: [],
    transform: asArray,
  },
  maxWarnings: {
    default: -1,
    transform: asInt,
  },
  noEslintrc: {
    name: 'useEslintrc',
    default: false,
    transform: negate,
  },
  noIgnore: {
    name: 'ignore',
    default: false,
    transform: negate,
  },
  noInlineConfig: {
    name: 'allowInlineConfig',
    default: false,
    transform: negate,
  },
  parser: {
    default: null,
  },
  parserOptions: {
    default: {},
  },
  plugin: {
    name: 'plugins',
    default: [],
    transform: asArray,
  },
  quiet: {
    default: false,
  },
  reportUnusedDisableDirectives: {
    default: false,
  },
  resolvePluginsRelativeTo: {
    default: undefined,
  },
  rules: {
    default: {},
  },
  rulesdir: {
    name: 'rulePaths',
    default: [],
    transform: asArray,
  },
};

const BASE_CONFIG = {
  ...OLD_BASE_CONFIG,
  config: {
    name: 'overrideConfigFile',
    default: null,
  },
  env: {
    name: 'overrideConfig.env',
    default: {},
  },
  global: {
    name: 'overrideConfig.globals',
    default: {},
  },
  ignorePattern: {
    name: 'overrideConfig.ignorePatterns',
    default: [],
    transform: asArray,
  },
  parser: {
    name: 'overrideConfig.parser',
    default: null,
  },
  parserOptions: {
    name: 'overrideConfig.parserOptions',
    default: {},
  },
  plugin: {
    name: 'overrideConfig.plugins',
    default: [],
    transform: asArray,
  },
  reportUnusedDisableDirectives: {
    default: null,
  },
  rules: {
    name: 'overrideConfig.rules',
    default: {},
  },
};

/* eslint-disable no-param-reassign */
const normalizeCliOptions = (rawConfig, newApi) => {
  const configToUse = newApi ? BASE_CONFIG : OLD_BASE_CONFIG;
  return Object.keys(configToUse).reduce((config, key) => {
    const {
      name = key,
      transform = identity,
      default: defaultValue,
    } = configToUse[key];

    const value = rawConfig[key] !== undefined ? rawConfig[key] : defaultValue;

    dotProp.set(config, name, transform(value));

    return config;
  }, {});
};
/* eslint-enable no-param-reassign */

const normalizeConfig = (config, newApi) => {
  return {
    ...config,
    cliOptions: normalizeCliOptions(config.cliOptions || {}, newApi),
  };
};

module.exports = normalizeConfig;
