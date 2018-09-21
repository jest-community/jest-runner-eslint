const identity = v => v;
const negate = v => !v;
const asArray = v => (typeof v === 'string' ? [v] : v);
const asInt = v => (typeof v === 'number' ? v : parseInt(v, 10));

const BASE_CONFIG = {
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
    default: null,
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
    default: null,
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
  rules: {
    default: null,
  },
  rulesdir: {
    name: 'rulePaths',
    default: [],
    transform: asArray,
  },
};

/* eslint-disable no-param-reassign */
const normalizeCliOptions = rawConfig =>
  Object.keys(BASE_CONFIG).reduce((config, key) => {
    const {
      name = key,
      transform = identity,
      default: defaultValue,
    } = BASE_CONFIG[key];

    const value = rawConfig[key] !== undefined ? rawConfig[key] : defaultValue;

    return Object.assign({}, config, {
      [name]: transform(value),
    });
  }, {});
/* eslint-enable no-param-reassign */

const normalizeConfig = config => {
  return Object.assign({}, config, {
    cliOptions: normalizeCliOptions(config.cliOptions || {}),
  });
};

module.exports = normalizeConfig;
