const { ESLint } = require('eslint');

module.exports = {
  cliOptions: {
    // `ESLint` requires this to be an object, not an array
    global: ESLint ? { hello: true } : ['hello'],
  },
};
