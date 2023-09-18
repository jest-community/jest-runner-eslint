const runJest = require('./runJest');

it('does not log warnings as errors in quiet mode', async () => {
  expect(await runJest('quiet-mode')).toMatchSnapshot();
});
