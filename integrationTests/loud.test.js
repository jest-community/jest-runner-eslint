const runJest = require('./runJest');

it('Outputs warnings as console messages', () => {
  return expect(runJest('loud')).resolves.toMatchSnapshot();
});
