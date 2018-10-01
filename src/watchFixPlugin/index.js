const chalk = require('chalk');
const ora = require('ora');
const configOverrides = require('../utils/configOverrides');

const wait = time => new Promise(res => setTimeout(res, time));

class ESLintWatchFixPlugin {
  constructor({ stdout, config }) {
    this._stdout = stdout;
    this._key = config.key || 'F';
  }

  // eslint-disable-next-line class-methods-use-this
  async run() {
    const fix = configOverrides.getFix();
    configOverrides.setFix(!fix);
    await this._showLoading(fix);
    return true;
  }

  getUsageInfo() {
    return {
      key: this._key,
      prompt: this._getPrompt(),
    };
  }

  async _showLoading(fix) {
    this._stdout.write('\n');
    const spinner = ora({
      text: chalk.italic.dim(`${fix ? 'Disabling' : 'Enabling'} ESLint --fix`),
      stream: this._stdout,
    }).start();

    await wait(700);
    spinner.succeed();
    await wait(500);
  }

  // eslint-disable-next-line class-methods-use-this
  _getPrompt() {
    const fix = configOverrides.getFix();
    if (fix === undefined) {
      return 'override ESLint --fix';
    }

    if (!fix) {
      return `toggle ESLint --fix ${chalk.italic('(disabled)')}`;
    }
    return `toggle ESLint --fix ${chalk.italic('(enabled)')}`;
  }
}

module.exports = ESLintWatchFixPlugin;
