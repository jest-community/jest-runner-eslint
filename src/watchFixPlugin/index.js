const chalk = require('chalk');
const configOverrides = require('../utils/configOverrides');

class ESLintWatchFixPlugin {
  constructor({ stdout, config }) {
    this._stdout = stdout;
    this._key = config.key || 'F';
  }

  // eslint-disable-next-line class-methods-use-this
  async run() {
    const fix = configOverrides.getFix();
    configOverrides.setFix(!fix);
    return true;
  }

  getUsageInfo() {
    const getPrompt = () => {
      const fix = configOverrides.getFix();
      if (fix === undefined) {
        return 'override ESLint --fix';
      }
      if (!fix) {
        return `toggle ESLint --fix ${chalk.italic('(disabled)')}`;
      }
      return `toggle ESLint --fix ${chalk.italic('(enabled)')}`;
    };

    return {
      key: this._key,
      prompt: getPrompt(),
    };
  }
}

module.exports = ESLintWatchFixPlugin;
