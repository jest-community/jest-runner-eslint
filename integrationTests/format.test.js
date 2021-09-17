const runJest = require('./runJest');

it('Applies custom formatter', async () => {
  expect(await runJest('format')).toMatchSnapshot();
});
