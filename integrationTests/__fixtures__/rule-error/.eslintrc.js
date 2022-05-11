const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');

rulesDirPlugin.RULES_DIR  = path.join(__dirname, 'rules');

module.exports = {
  plugins: ['rulesdir'],
  rules: {
    quotes: ['error', 'double'],
    'rulesdir/intentional-error': ['error'],
  }
}
