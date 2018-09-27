const configOverrides = require('../utils/configOverrides');

class ESLintWatchFixPlugin {
  run() {
    configOverrides.setFix(!configOverrides.getFix());
    return Promise.resolve(true);
  }
  getUsageInfo() {
    return {
      key: 'F',
      prompt: `${configOverrides.getFix() ? 'disable' : 'enable'} ESLint --fix`,
    };
  }
}

module.exports = ESLintWatchFixPlugin;
