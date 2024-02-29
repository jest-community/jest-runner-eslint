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

const BASE_CONFIG = {
  cache: {
    default: false,
  },
  cacheLocation: {
    default: '.eslintcache',
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
  maxWarnings: {
    default: -1,
    transform: asInt,
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
  quiet: {
    default: false,
  },
  config: {
    name: 'overrideConfigFile',
    default: null,
  },
};

const LEGACY_CONFIG = {
  ...BASE_CONFIG,
  ext: {
    name: 'extensions',
    default: ['.js'],
    transform: asArray,
  },
  ignorePath: {
    default: null,
  },
  rulesdir: {
    name: 'rulePaths',
    default: [],
    transform: asArray,
  },
  resolvePluginsRelativeTo: {
    default: undefined,
  },
  noEslintrc: {
    name: 'useEslintrc',
    default: false,
    transform: negate,
  },
  reportUnusedDisableDirectives: {
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
  rules: {
    name: 'overrideConfig.rules',
    default: {},
  },
};

const FLAT_CONFIG = {
  ...BASE_CONFIG,
  reportUnusedDisableDirectives: {
    name: 'overrideConfig.linterOptions.reportUnusedDisableDirectives',
    default: false,
  },
};

const normalizeCliOptions = (configType, rawConfig) => {
  const configConfig = configType === 'flat' ? FLAT_CONFIG : LEGACY_CONFIG;
  return Object.keys(configConfig).reduce((config, key) => {
    const {
      name = key,
      transform = identity,
      default: defaultValue,
    } = configConfig[key];

    const value = rawConfig[key] !== undefined ? rawConfig[key] : defaultValue;

    dotProp.set(config, name, transform(value));

    return config;
  }, {});
};

const normalizeConfig = (configType, config) => {
  return {
    ...config,
    cliOptions: normalizeCliOptions(configType, config.cliOptions || {}),
  };
};

module.exports = normalizeConfig;
