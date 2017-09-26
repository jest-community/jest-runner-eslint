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
    default: true,
    transform: negate,
  },
  noIgnore: {
    name: 'ignore',
    default: true,
    transform: negate,
  },
  noInlineConfig: {
    name: 'allowInlineConfig',
    default: true,
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
const normalizeConfig = rawConfig =>
  Object.keys(BASE_CONFIG).reduce((config, key) => {
    const {
      name = key,
      transform = identity,
      default: defaultValue,
    } = BASE_CONFIG[key];

    if (rawConfig[key]) {
      config[name] = transform(rawConfig[key]);
    }

    if (config[name] === undefined) {
      config[name] = defaultValue;
    }

    return config;
  }, {});
/* eslint-enable no-param-reassign */

module.exports = normalizeConfig;
