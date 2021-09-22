const runJest = require('./runJest');

it('Outputs warnings as console messages', async () => {
  expect(await runJest('loud')).toMatchSnapshot();
});
