const identity = v => v;
const negate = v => !v;
const asArray = v => (typeof v === 'string' ? [v] : v);

const BASE_CONFIG = {
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
  format: {
    default: null
  },
  global: {
    name: 'globals',
    default: [],
    transform: asArray,
  },
  ignorePath: {
    default: null,
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
    default: 'espree',
  },
  parserOptions: {
    default: {},
  },
  plugin: {
    name: 'plugins',
    default: [],
    transform: asArray,
  },
  rule: {
    name: 'rules',
    default: null,
    transform: asArray,
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
