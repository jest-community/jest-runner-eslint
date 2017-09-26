const normalizeConfig = require('../normalizeConfig');

it('ignores unkown options', () => {
  expect(normalizeConfig({ other: true })).not.toMatchObject({
    other: true,
  });
});

it('normalizes noInlineConfig', () => {
  expect(normalizeConfig({})).toMatchObject({
    allowInlineConfig: true,
  });

  expect(normalizeConfig({ noInlineConfig: true })).toMatchObject({
    allowInlineConfig: false,
  });

  expect(normalizeConfig({ noInlineConfig: false })).toMatchObject({
    allowInlineConfig: true,
  });
});

it('normalizes cacheLocation', () => {
  expect(normalizeConfig({})).toMatchObject({
    cacheLocation: '.eslintcache',
  });

  expect(normalizeConfig({ cacheLocation: '/path/to/cache' })).toMatchObject({
    cacheLocation: '/path/to/cache',
  });
});

it('normalizes config', () => {
  expect(normalizeConfig({})).toMatchObject({
    configFile: null,
  });

  expect(normalizeConfig({ config: '/path/to/config' })).toMatchObject({
    configFile: '/path/to/config',
  });
});

it('normalizes env', () => {
  expect(normalizeConfig({})).toMatchObject({
    envs: [],
  });

  expect(normalizeConfig({ env: 'mocha' })).toMatchObject({
    envs: ['mocha'],
  });

  expect(normalizeConfig({ env: ['mocha', 'browser'] })).toMatchObject({
    envs: ['mocha', 'browser'],
  });
});

it('normalizes ext', () => {
  expect(normalizeConfig({})).toMatchObject({
    extensions: ['.js'],
  });

  expect(normalizeConfig({ ext: '.ts' })).toMatchObject({
    extensions: ['.ts'],
  });

  expect(normalizeConfig({ ext: ['.js', '.jsx', '.ts'] })).toMatchObject({
    extensions: ['.js', '.jsx', '.ts'],
  });
});

it('normalizes fix', () => {
  expect(normalizeConfig({})).toMatchObject({
    fix: false,
  });

  expect(normalizeConfig({ fix: true })).toMatchObject({
    fix: true,
  });
});

it('normalizes global', () => {
  expect(normalizeConfig({})).toMatchObject({
    globals: [],
  });

  expect(normalizeConfig({ global: 'it' })).toMatchObject({
    globals: ['it'],
  });

  expect(normalizeConfig({ global: ['it', 'describe'] })).toMatchObject({
    globals: ['it', 'describe'],
  });
});

it('normalizes noIgnore', () => {
  expect(normalizeConfig({})).toMatchObject({
    ignore: true,
  });

  expect(normalizeConfig({ noIgnore: true })).toMatchObject({
    ignore: false,
  });
});

it('normalizes ignorePath', () => {
  expect(normalizeConfig({})).toMatchObject({
    ignorePath: null,
  });

  expect(normalizeConfig({ ignorePath: '/path/to/ignore' })).toMatchObject({
    ignorePath: '/path/to/ignore',
  });
});

it('normalizes parser', () => {
  expect(normalizeConfig({})).toMatchObject({
    parser: 'espree',
  });

  expect(normalizeConfig({ parser: 'flow' })).toMatchObject({
    parser: 'flow',
  });
});

it('normalizes parserOptions', () => {
  expect(normalizeConfig({})).toMatchObject({
    parserOptions: {},
  });

  expect(
    normalizeConfig({ parserOptions: { ecmaVersion: 2015 } }),
  ).toMatchObject({
    parserOptions: { ecmaVersion: 2015 },
  });
});

it('normalizes plugin', () => {
  expect(normalizeConfig({})).toMatchObject({
    plugins: [],
  });

  expect(normalizeConfig({ plugin: 'prettier' })).toMatchObject({
    plugins: ['prettier'],
  });

  expect(normalizeConfig({ plugin: ['prettier'] })).toMatchObject({
    plugins: ['prettier'],
  });
});

it('normalizes rulesdir', () => {
  expect(normalizeConfig({})).toMatchObject({
    rulePaths: [],
  });

  expect(normalizeConfig({ rulesdir: '/path/to/rules' })).toMatchObject({
    rulePaths: ['/path/to/rules'],
  });

  expect(
    normalizeConfig({ rulesdir: ['/path/to/rules', '/other/path'] }),
  ).toMatchObject({
    rulePaths: ['/path/to/rules', '/other/path'],
  });
});

it('normalizes rule', () => {
  expect(normalizeConfig({})).toMatchObject({
    rules: null,
  });

  expect(normalizeConfig({ rule: ['quotes: [2, double]'] })).toMatchObject({
    rules: ['quotes: [2, double]'],
  });

  expect(normalizeConfig({ rule: 'quotes: [2, double]' })).toMatchObject({
    rules: ['quotes: [2, double]'],
  });
});

it('normalizes noEslintrc', () => {
  expect(normalizeConfig({})).toMatchObject({
    useEslintrc: true,
  });

  expect(normalizeConfig({ noEslintrc: true })).toMatchObject({
    useEslintrc: false,
  });
});
