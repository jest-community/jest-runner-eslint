const chalk = require('chalk');
const inquirer = require('inquirer');
const ansiEscapes = require('ansi-escapes');
const {
  setConfigOverrides,
  getConfigOverrides,
} = require('../utils/configOverrides');

const TO_RULE_VALUES = {
  error: 2,
  warn: 1,
  off: 0,
};

const FROM_RULE_VALUES = {
  2: 'error',
  1: 'warn',
  0: 'off',
};

class ESLintWatchPlugin {
  constructor({ stdout }) {
    this._stdout = stdout;
  }

  // eslint-disable-next-line class-methods-use-this
  onKey() {}

  // eslint-disable-next-line class-methods-use-this, consistent-return
  async run() {
    try {
      this._println(ansiEscapes.clearScreen);
      const {
        rules: ruleOverrides = [],
        fix: fixOverride,
      } = getConfigOverrides();

      if (Object.keys(ruleOverrides).length) {
        this._println(chalk.bold('Current rule overrides'));
        Object.keys(ruleOverrides).forEach(name => {
          const value = ruleOverrides[name];
          this._println(
            `  ${name} ${chalk.dim.italic(`(${FROM_RULE_VALUES[value]})`)}`,
          );
        });
        this._println();
      }

      if (fixOverride !== undefined) {
        this._println(chalk.bold('Other overrides'));
        this._println(
          `  --fix ${chalk.dim.italic(`(${fixOverride ? 'true' : 'false'})`)}`,
        );
        this._println();
      }

      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'ESLint',
          choices: [
            { name: ' Override --fix', value: 'fix' },
            { name: ' Override rules', value: 'rules' },
          ].concat(
            Object.keys(getConfigOverrides()).length > 0
              ? [
                  new inquirer.Separator(),
                  {
                    name: ' Clear overrides',
                    value: 'clear',
                  },
                ]
              : [],
          ),
        },
      ]);

      if (action === 'rules') {
        const { name, value } = await inquirer.prompt([
          {
            type: 'text',
            message: 'Rule name',
            name: 'name',
          },
          {
            type: 'list',
            message: 'Value',
            name: 'value',
            choices: [
              { name: 'Off', value: 'off' },
              { name: 'Warning', value: 'warn' },
              { name: 'Error', value: 'error' },
            ],
          },
        ]);
        const { rules = {} } = getConfigOverrides();
        setConfigOverrides({
          rules: Object.assign({}, rules, { [name]: TO_RULE_VALUES[value] }),
        });
      } else if (action === 'fix') {
        const { value } = await inquirer.prompt([
          {
            type: 'list',
            message: 'Value',
            name: 'value',
            choices: [
              { name: 'Enable', value: true },
              { name: 'Disable', value: false },
            ],
          },
        ]);
        setConfigOverrides({ fix: value });
      } else if (action === 'clear') {
        setConfigOverrides({ fix: undefined, rules: {} });
      } else {
        throw Error(`unknown action ${action}`);
      }

      process.stdin.setRawMode(true);
      process.stdin.resume();
      return true;
    } catch (e) {
      this._println(e);
      process.exit(1);
    }
  }

  // eslint-disable-next-line
  getUsageInfo() {
    const { fix, rules = {} } = getConfigOverrides();
    const numRules = Object.keys(rules).length;
    const fixPrompt =
      fix !== undefined ? `--fix=${fix ? 'true' : false}` : null;

    const rulesPrompt =
      numRules > 0 ? `${numRules} ${numRules === 1 ? 'rule' : 'rules'}` : null;

    const currentOverridesPrompt =
      fixPrompt || rulesPrompt
        ? chalk.italic(
            ` (current overrides: ${[rulesPrompt, fixPrompt]
              .filter(Boolean)
              .join(' and ')})`,
          )
        : '';

    return {
      key: 'e',
      prompt: `configure ESLint${currentOverridesPrompt}`,
    };
  }

  _println(str) {
    this._stdout.write(`${str}\n`);
  }
}

module.exports = ESLintWatchPlugin;
