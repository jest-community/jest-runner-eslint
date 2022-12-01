const runJest = require('./runJest');

it('Reports with the github actions reporter', async () => {
  const priorActionsConfig = process.env.GITHUB_ACTIONS;
  process.env.GITHUB_ACTIONS = true;
  expect(await runJest('github-actions')).toMatchSnapshot();
  process.env.GITHUB_ACTIONS = priorActionsConfig;
});
