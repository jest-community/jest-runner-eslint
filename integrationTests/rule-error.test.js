const runJest = require('./runJest');

it('Correctly prints the error message from a failing ESLint rule', async () => {
  expect(await runJest('rule-error')).toMatchSnapshot();
});
