const { version } = require('eslint/package.json');
const semver = require('semver');
const runJest = require('./runJest');

(semver.satisfies(version, '>=8.41') ? it : it.skip)(
  'Works with the new flat config format',
  async () => {
    expect(await runJest('flat-config')).toMatchSnapshot();
  },
);
