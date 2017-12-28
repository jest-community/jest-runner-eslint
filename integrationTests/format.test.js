const runJest = require('./runJest');

it('Applies custom formatter', () => {
  return expect(runJest('format')).resolves.toMatchSnapshot();
});
