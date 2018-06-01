const { setConfigOverrides } = require('../utils/configOverrides');

class ESLintWatchPlugin {
  // eslint-disable-next-line
  run() {
    setConfigOverrides({
      global: ['rogelio'],
      globals: ['rogelio'],
    });
    return Promise.resolve(true);
  }

  // eslint-disable-next-line
  getUsageInfo() {
    return {
      key: 'e',
      prompt: 'configure ESLint',
    };
  }
}

module.exports = ESLintWatchPlugin;
