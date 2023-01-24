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
          results:
            options.cliEngine.errorCount > 0
              ? [{ errorCount: options.cliEngine.errorCount, warningCount: 0 }]
              : [],
          errorCount: options.cliEngine.errorCount,
          warningCount: 0,
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

it('Requires the config setupTestFrameworkScriptFile when specified', async () => {
  const setupFile = path.join(__dirname, './path/to/setupFile.js');

  let setupFileWasLoaded = false;
  jest.doMock(
    setupFile,
    () => {
      setupFileWasLoaded = true;
    },
    { virtual: true },
  );

  await runESLintRunnerWithMockedEngine({
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

it('Requires the config setupFilesAfterEnv when specified', async () => {
  const setupFiles = [
    path.join(__dirname, './path/to/setupFileFoo.js'),
    path.join(__dirname, './path/to/setupFileBar.js'),
  ];

  const setupFilesWereLoaded = setupFiles.map(() => false);

  setupFiles.forEach((setupFile, index) => {
    jest.doMock(
      setupFile,
      () => {
        setupFilesWereLoaded[index] = true;
      },
      { virtual: true },
    );
  });

  await runESLintRunnerWithMockedEngine({
    cliEngine: {
      ignoredFiles: ['/path/to/file.test.js'],
      errorCount: 0,
    },
    runESLint: {
      testPath: 'path/to/file.test.js',
      config: {
        setupFilesAfterEnv: setupFiles,
      },
    },
  });

  expect(setupFilesWereLoaded).toEqual([true, true]);
});

it('Returns "skipped" when the test path is ignored', async () => {
  const result = await runESLintRunnerWithMockedEngine({
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
    numPendingTests: 0,
    skipped: true,
  });
});

it('Returns "passed" when the test passed', async () => {
  const result = await runESLintRunnerWithMockedEngine({
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

it('Returns "fail" when the test failed', async () => {
  const result = await runESLintRunnerWithMockedEngine({
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
