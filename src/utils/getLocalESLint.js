const path = require('path');
const findUp = require('find-up');

const getLocalESLint = config => {
  const nodeModulesPath = findUp.sync('node_modules', { cwd: config.rootDir });
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(path.resolve(nodeModulesPath, 'eslint'));
  } catch (e) {
    // try resolving eslint using normal node resolution mechanism
    try {
      // eslint-disable-next-line global-require
      return require('eslint');
    } catch (ee) {
      // ignore
    }
    throw e;
  }
};

module.exports = getLocalESLint;
