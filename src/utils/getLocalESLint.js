const resolve = require('resolve');

const getLocalESLint = config => {
  const basedir = config.rootDir || process.cwd();
  const eslintModulePath = resolve.sync('eslint', { basedir });
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(eslintModulePath);
};

module.exports = getLocalESLint;
