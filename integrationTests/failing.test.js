const runJest = require('./runJest');

it('Works when it has failing tests', async () => {
  expect(await runJest('failing')).toMatchSnapshot();
});
