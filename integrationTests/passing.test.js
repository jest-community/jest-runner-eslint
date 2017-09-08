const runJest = require('./runJest');

it('Works when it has only passing tests', () => {
  return expect(runJest('passing')).resolves.toMatchSnapshot();
});

it('Works when it has only passing tests and --coverage', () => {
  return expect(runJest('passing', ['--coverage'])).resolves.toMatchSnapshot();
});
