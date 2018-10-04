/* eslint-disable class-methods-use-this, global-require */
const path = require('path');

const runESLintRunnerWithMockedEngine = options => {
  jest.resetModules();
  jest.doMock('eslint', () => ({
    CLIEngine: class {
      isPathIgnored(file) {
        return options.cliEngine.ignoredFiles.includes(file);
      }

      executeOnFiles() {
        return {
          errorCount: options.cliEngine.errorCount,
        };
      }

      getFormatter() {
        return () => {};
      }
    },
  }));
  const runESLint = require('../runESLint');

  return runESLint({ extraOptions: {}, ...options.runESLint });
};

it('Requires the config setupTestFrameworkScriptFile when specified', () => {
  const setupFile = path.join(__dirname, './path/to/setupFile.js');

  let setupFileWasLoaded = false;
  jest.doMock(
    setupFile,
    () => {
      setupFileWasLoaded = true;
    },
    { virtual: true },
  );

  runESLintRunnerWithMockedEngine({
    cliEngine: {
      ignoredFiles: ['/path/to/file.test.js'],
      errorCount: 0,
    },
    runESLint: {
      testPath: 'path/to/file.test.js',
      config: {
        setupTestFrameworkScriptFile: setupFile,
      },
    },
  });

  expect(setupFileWasLoaded).toBeTruthy();
});

it('Returns "skipped" when the test path is ignored', () => {
  const result = runESLintRunnerWithMockedEngine({
    cliEngine: {
      ignoredFiles: ['/path/to/file.test.js'],
      errorCount: 0,
    },
    runESLint: {
      testPath: '/path/to/file.test.js',
      config: {},
    },
  });

  expect(result).toMatchObject({
    numFailingTests: 0,
    numPassingTests: 0,
    numPendingTests: 1,
    skipped: true,
  });
});

it('Returns "passed" when the test passed', () => {
  const result = runESLintRunnerWithMockedEngine({
    cliEngine: {
      ignoredFiles: [],
      errorCount: 0,
    },
    runESLint: {
      testPath: '/path/to/file.test.js',
      config: {},
    },
  });

  expect(result).toMatchObject({
    numFailingTests: 0,
    numPassingTests: 1,
    numPendingTests: 0,
  });
});

it('Returns "fail" when the test failed', () => {
  const result = runESLintRunnerWithMockedEngine({
    cliEngine: {
      ignoredFiles: [],
      errorCount: 1,
    },
    runESLint: {
      testPath: '/path/to/file.test.js',
      config: {},
    },
  });

  expect(result).toMatchObject({
    numFailingTests: 1,
    numPassingTests: 0,
    numPendingTests: 0,
  });
});
