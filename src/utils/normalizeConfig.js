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
  ignorePath: {
    default: null,
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
  quiet: {
    default: false,
  },
  resolvePluginsRelativeTo: {
    default: undefined,
  },
  rulesdir: {
    name: 'rulePaths',
    default: [],
    transform: asArray,
  },
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
    name: 'overrideConfig.reportUnusedDisableDirectives',
    default: false,
  },
  rules: {
    name: 'overrideConfig.rules',
    default: {},
  },
};

const normalizeCliOptions = rawConfig => {
  return Object.keys(BASE_CONFIG).reduce((config, key) => {
    const {
      name = key,
      transform = identity,
      default: defaultValue,
    } = BASE_CONFIG[key];

    const value = rawConfig[key] !== undefined ? rawConfig[key] : defaultValue;

    dotProp.set(config, name, transform(value));

    return config;
  }, {});
};

const normalizeConfig = config => {
  return {
    ...config,
    cliOptions: normalizeCliOptions(config.cliOptions || {}),
  };
};

module.exports = normalizeConfig;
