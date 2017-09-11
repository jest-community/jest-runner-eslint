const getLocalESLint = require('./utils/getLocalESLint');
const toTestResult = require('./utils/toTestResult');

const skip = ({ start, end, testPath }) =>
  toTestResult({
    stats: {
      failures: 0,
      pending: 1,
      passes: 0,
      start,
      end,
    },
    skipped: true,
    tests: [
      {
        duration: end - start,
        testPath,
      },
    ],
    jestTestPath: testPath,
  });

const fail = ({ start, end, testPath, errorMessage }) =>
  toTestResult({
    errorMessage,
    stats: {
      failures: 1,
      pending: 0,
      passes: 0,
      start,
      end,
    },
    tests: [
      {
        duration: end - start,
        testPath,
        errorMessage,
      },
    ],
    jestTestPath: testPath,
  });

const pass = ({ start, end, testPath }) =>
  toTestResult({
    stats: {
      failures: 0,
      pending: 0,
      passes: 1,
      start,
      end,
    },
    tests: [
      {
        duration: end - start,
        testPath,
      },
    ],
    jestTestPath: testPath,
  });

const runESLint = ({ testPath, config }, workerCallback) => {
  try {
    const start = +new Date();
    const { CLIEngine } = getLocalESLint(config);
    const cli = new CLIEngine({});
    if (cli.isPathIgnored(testPath)) {
      const end = +new Date();
      workerCallback(null, skip({ start, end, testPath }));
    } else {
      const report = cli.executeOnFiles([testPath]);
      const end = +new Date();

      if (report.errorCount > 0) {
        const formatter = cli.getFormatter();
        const errorMessage = formatter(
          CLIEngine.getErrorResults(report.results),
        );

        workerCallback(null, fail({ start, end, testPath, errorMessage }));
      } else {
        workerCallback(null, pass({ start, end, testPath }));
      }
    }
  } catch (e) {
    workerCallback(e);
  }
};

module.exports = runESLint;
