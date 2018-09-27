class ESLintWatchFixPlugin {
  constructor() {
    this.fix = false;
  }
  run() {
    this.fix = !this.fix;
    return Promise.resolve(true);
  }
  getUsageInfo() {
    return {
      key: 'F',
      prompt: `${this.fix ? 'disable' : 'enable'} ESLint --fix`,
    };
  }
}

module.exports = ESLintWatchFixPlugin;
