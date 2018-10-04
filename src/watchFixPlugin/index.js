const { getVersion: getJestVersion } = require('jest');
const chalk = require('chalk');
const configOverrides = require('../utils/configOverrides');

const majorJestVersion = parseInt(getJestVersion().split('.')[0], 10);

if (majorJestVersion < 23) {
  // eslint-disable-next-line no-console
  throw new Error(`Insufficient Jest version for jest-runner-eslint watch plugin
  
  Watch plugins are only available in Jest 23.0.0 and above.
  Upgrade your version of Jest in order to use it.
`);
}

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
