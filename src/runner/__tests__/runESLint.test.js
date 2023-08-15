/* eslint-disable class-methods-use-this, global-require */
const path = require('path');

const runESLintRunnerWithMockedEngine = ({
  mockOptions,
  runESLintOptions,
  extraOptions,
}) => {
  jest.resetModules();
  jest.doMock('eslint', () => ({
    ESLint: class {
      isPathIgnored(file) {
        return mockOptions.ignoredFiles.includes(file);
      }

      lintFiles() {
        return mockOptions.errorCount > 0
          ? [{ errorCount: mockOptions.errorCount, warningCount: 0 }]
          : [];
      }

      loadFormatter() {
        return Promise.resolve({ format() {} });
      }

      // eslint-disable-next-line no-unused-vars
      async static outputFixes(report) {
      }
    },
  }));
  const runESLint = require('../runESLint');

  return runESLint({ extraOptions: extraOptions || {}, ...runESLintOptions });
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
    mockOptions: {
      ignoredFiles: ['/path/to/file.test.js'],
      errorCount: 0,
    },
    runESLintOptions: {
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
    mockOptions: {
      ignoredFiles: ['/path/to/file.test.js'],
      errorCount: 0,
    },
    runESLintOptions: {
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
    mockOptions: {
      ignoredFiles: ['/path/to/file.test.js'],
      errorCount: 0,
    },
    runESLintOptions: {
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
    mockOptions: {
      ignoredFiles: [],
      errorCount: 0,
    },
    runESLintOptions: {
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
    mockOptions: {
      ignoredFiles: [],
      errorCount: 1,
    },
    runESLintOptions: {
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

it('Not to be override by undefined in extraOptions', async () => {
  const result = await runESLintRunnerWithMockedEngine({
    mockOptions: {
      ignoredFiles: [],
      errorCount: 0,
    },
    runESLintOptions: {
      testPath: '/path/to/file.test.js',
      config: {},
    },
    extraOptions: {
      fix: true,
    },
  });

  expect(result.cliOptions.fix).toBeTruthy();
});
