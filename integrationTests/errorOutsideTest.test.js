const runJest = require('./runJest');

it('Works when it has an error outside the tests', () => {
  return expect(runJest('errorOutsideTest')).resolves.toMatchSnapshot();
});
