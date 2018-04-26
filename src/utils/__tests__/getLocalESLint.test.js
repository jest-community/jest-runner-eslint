const getLocalESLint = require('../getLocalESLint');
const requiredESLint = require('eslint');

it('requires eslint', () => {
  // eslint-disable-next-line global-require
  expect(getLocalESLint({})).toBe(requiredESLint);
});

it('finds eslint with custom rootDir', () => {
  // eslint-disable-next-line global-require
  expect(getLocalESLint({ rootDir: __dirname })).toBe(requiredESLint);
});
