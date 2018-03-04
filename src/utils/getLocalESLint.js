const path = require('path');
const findUp = require('find-up');

const getLocalESLint = config => {
  var nodeModulesPath = findUp.sync('node_modules', { cwd: config.rootDir });
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(path.resolve(nodeModulesPath, 'eslint'));
  } catch(e) {
    // try resolving eslint using normal eslint resolution mechanism
    try {
      return require('eslint');
    } catch(ee) {}
    throw e;
  }
};

module.exports = getLocalESLint;
