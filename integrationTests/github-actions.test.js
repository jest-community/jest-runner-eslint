const { version } = require('jest/package.json');
const semver = require('semver');
const runJest = require('./runJest');

// NOTE: Jest versions <28 don't have a github action reporter, so this test is
// not valid.
if (semver.satisfies(version, '<28')) {
  it.skip('Reports with the github actions reporter', () => {});
} else {
  it('Reports with the github actions reporter', async () => {
    const priorActionsConfig = process.env.GITHUB_ACTIONS;
    process.env.GITHUB_ACTIONS = true;
    expect(await runJest('github-actions')).toMatchSnapshot();
    process.env.GITHUB_ACTIONS = priorActionsConfig;
  });
}
