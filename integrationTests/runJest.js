// eslint-disable-next-line import/no-extraneous-dependencies
const execa = require('execa');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const normalize = output =>
  output
    .replace(/((✕|✓) .* )\(\d*(\.\d+)? ?m?s\)/g, '$1')
    .replace(new RegExp(rootDir, 'g'), '/mocked-path-to-jest-runner-mocha')
    .replace(/(Time: {8})\d*(\.\d+)? ?m?s/, '$1');

const runJest = (testDir, options = []) => {
  jest.setTimeout(30000);
  return execa(
    'jest',
    ['--useStderr', '--no-watchman', '--no-cache'].concat(options),
    {
      cwd: path.join(__dirname, '__fixtures__', testDir),
      env: { ...process.env, FORCE_COLOR: 0 },
      reject: false,
    },
  ).then(({ stdout, stderr }) => `${normalize(stderr)}\n${normalize(stdout)}`);
};

module.exports = runJest;
