const runJest = require('./runJest');

it('Works when it has only passing tests', async () => {
  expect(await runJest('passing')).toMatchSnapshot();
});
