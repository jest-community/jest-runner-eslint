const { version } = require('eslint/package.json');
const semver = require('semver');
const runJest = require('./runJest');

const isBelow6 = semver.satisfies(version, '<6');

// Note: ESLint versions <6 have a different error message for this test. The
// snapshot file contains both messages so we can test across both versions.
// Without the skipped tests for the "other" version, the tests will always fail
// with `1 snapshot obsolete`.
if (isBelow6) {
  it.skip("Doesn't override parser when not set", () => {});
  it("Doesn't override parser when not set [ESLint<6]", async () => {
    expect(await runJest('custom-parser')).toMatchSnapshot();
  });
} else {
  it("Doesn't override parser when not set", async () => {
    expect(await runJest('custom-parser')).toMatchSnapshot();
  });
  it.skip("Doesn't override parser when not set [ESLint<6]", () => {});
}
