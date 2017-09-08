const runJest = require('./runJest');

const normalize = res => res.replace(' [ERR_ASSERTION]', '');

it('Works when it has failing tests', () => {
  return expect(runJest('failing').then(normalize)).resolves.toMatchSnapshot();
});
