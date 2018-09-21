const runJest = require('./runJest');

it('Fails if more than max warnings', () => {
  return expect(runJest('max-warnings')).resolves.toMatchSnapshot();
});
