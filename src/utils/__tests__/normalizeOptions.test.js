const normalizeOptions = require('../normalizeOptions');

it('normalizes noInlineConfig', () => {
  expect(normalizeOptions({})).toMatchObject({
    allowInlineConfig: true,
  });

  expect(normalizeOptions({ noInlineConfig: true })).toMatchObject({
    allowInlineConfig: false,
  });

  expect(normalizeOptions({ noInlineConfig: false })).toMatchObject({
    allowInlineConfig: true,
  });
});

it('normalizes cacheLocation', () => {
  expect(normalizeOptions({})).toMatchObject({
    cacheLocation: '.eslintcache',
  });

  expect(normalizeOptions({ cacheLocation: '/path/to/cache' })).toMatchObject({
    cacheLocation: '/path/to/cache',
  });
});

it('normalizes config', () => {
  expect(normalizeOptions({})).toMatchObject({
    configFile: null,
  });

  expect(normalizeOptions({ config: '/path/to/config' })).toMatchObject({
    configFile: '/path/to/config',
  });
});

it('normalizes envs', () => {
  expect(normalizeOptions({})).toMatchObject({
    envs: [],
  });

  expect(normalizeOptions({ envs: ['mocha', 'browser'] })).toMatchObject({
    envs: ['mocha', 'browser'],
  });
});

it('normalizes exts', () => {
  expect(normalizeOptions({})).toMatchObject({
    extensions: ['.js'],
  });

  expect(normalizeOptions({ exts: ['.js', '.jsx', '.ts'] })).toMatchObject({
    extensions: ['.js', '.jsx', '.ts'],
  });
});

it('normalizes fix', () => {
  expect(normalizeOptions({})).toMatchObject({
    fix: false,
  });

  expect(normalizeOptions({ fix: true })).toMatchObject({
    fix: true,
  });
});

it('normalizes globals', () => {
  expect(normalizeOptions({})).toMatchObject({
    globals: [],
  });

  expect(normalizeOptions({ globals: ['it', 'describe'] })).toMatchObject({
    globals: ['it', 'describe'],
  });
});

it('normalizes noIgnore', () => {
  expect(normalizeOptions({})).toMatchObject({
    ignore: true,
  });

  expect(normalizeOptions({ noIgnore: true })).toMatchObject({
    ignore: false,
  });
});

it('normalizes ignorePath', () => {
  expect(normalizeOptions({})).toMatchObject({
    ignorePath: null,
  });

  expect(normalizeOptions({ ignorePath: '/path/to/ignore' })).toMatchObject({
    ignorePath: '/path/to/ignore',
  });
});

it('normalizes parser', () => {
  expect(normalizeOptions({})).toMatchObject({
    parser: 'espree',
  });

  expect(normalizeOptions({ parser: 'flow' })).toMatchObject({
    parser: 'flow',
  });
});

it('normalizes parserOptions', () => {
  expect(normalizeOptions({})).toMatchObject({
    parserOptions: {},
  });

  expect(
    normalizeOptions({ parserOptions: { ecmaVersion: 2015 } }),
  ).toMatchObject({
    parserOptions: { ecmaVersion: 2015 },
  });
});

it('normalizes plugins', () => {
  expect(normalizeOptions({})).toMatchObject({
    plugins: [],
  });

  expect(normalizeOptions({ plugins: ['prettier'] })).toMatchObject({
    plugins: ['prettier'],
  });
});

it('normalizes rulesdir', () => {
  expect(normalizeOptions({})).toMatchObject({
    rulePaths: [],
  });

  expect(
    normalizeOptions({ rulesdir: ['/path/to/rules', '/other/path'] }),
  ).toMatchObject({
    rulePaths: ['/path/to/rules', '/other/path'],
  });
});

it('normalizes rules', () => {
  expect(normalizeOptions({})).toMatchObject({
    rules: null,
  });

  expect(normalizeOptions({ rules: [] })).toMatchObject({
    rules: [],
  });
});

it('normalizes noEslintrc', () => {
  expect(normalizeOptions({})).toMatchObject({
    useEslintrc: true,
  });

  expect(normalizeOptions({ noEslintrc: true })).toMatchObject({
    useEslintrc: false,
  });
});
