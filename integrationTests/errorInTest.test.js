const runJest = require('./runJest');

it('Works when it has an error in the tests', () => {
  return expect(runJest('errorInTest')).resolves.toMatchSnapshot();
});
