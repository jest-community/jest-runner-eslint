/* eslint-disable global-require */
const chalk = require('chalk');

jest.doMock('chalk', () => new chalk.constructor({ enabled: false }));

jest.useFakeTimers();

let WatchFixPlugin;
let configOverrides;

describe('watchFixPlugin', () => {
  beforeEach(() => {
    jest.resetModules();
    configOverrides = require('../../utils/configOverrides');
    WatchFixPlugin = require('../');
  });

  it('shows the correct prompt', async () => {
    const stdout = { write: jest.fn() };
    const config = {};
    const plugin = new WatchFixPlugin({ stdout, config });
    expect(plugin.getUsageInfo()).toEqual({
      key: 'F',
      prompt: 'override ESLint --fix',
    });

    await plugin.run(plugin);

    expect(plugin.getUsageInfo()).toEqual({
      key: 'F',
      prompt: 'toggle ESLint --fix (enabled)',
    });

    await plugin.run(plugin);

    expect(plugin.getUsageInfo()).toEqual({
      key: 'F',
      prompt: 'toggle ESLint --fix (disabled)',
    });
  });

  it('overrides the setting in configOverrides after each invocation', async () => {
    const stdout = { write: jest.fn() };
    const config = {};
    const plugin = new WatchFixPlugin({ stdout, config });
    expect(configOverrides.getFix()).toBeUndefined();

    await plugin.run(plugin);

    expect(configOverrides.getFix()).toBe(true);

    await plugin.run(plugin);

    expect(configOverrides.getFix()).toBe(false);
  });

  it('can customize the key', () => {
    const stdout = { write: jest.fn() };
    const config = { key: 'z' };
    const plugin = new WatchFixPlugin({ stdout, config });
    expect(plugin.getUsageInfo()).toEqual({
      key: 'z',
      prompt: 'override ESLint --fix',
    });
  });
});
