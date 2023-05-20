const { version } = require('eslint/package.json');
const semver = require('semver');
const runJest = require('./runJest');

(semver.satisfies(version, '<8.41') ? it : it.skip)(
  "Does not try to use flat config on eslint versions that don't support it",
  async () => {
    expect(
      await runJest('legacy-config-at-eslint.config.js'),
    ).toMatchSnapshot();
  },
);
