const { version } = require('eslint/package.json');
const semver = require('semver');
const runJest = require('./runJest');

// Note: ESLint versions 7 and 8 have a different error message or stack for
// this test. The snapshot file contains all messages so we can test across
// versions.  Without the skipped tests for the other versions, the tests will
// always fail with `1 snapshot obsolete`.
if (semver.satisfies(version, '7')) {
  it.skip("Doesn't override parser when not set", () => {});
  it("Doesn't override parser when not set [ESLint=7]", async () => {
    expect(await runJest('custom-parser')).toMatchSnapshot();
  });
} else {
  it("Doesn't override parser when not set", async () => {
    expect(await runJest('custom-parser')).toMatchSnapshot();
  });
  it.skip("Doesn't override parser when not set [ESLint=7]", () => {});
}
