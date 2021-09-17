const runJest = require('./runJest');

it('Fails if more than max warnings', async () => {
  expect(await runJest('max-warnings')).toMatchSnapshot();
});
