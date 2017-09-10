const getLocalESLint = require('./utils/getLocalESLint');
const toTestResult = require('./utils/toTestResult');

const isFileIgnored = ({ results, warningCount, errorCount }) => {
  return (
    warningCount === 1 &&
    errorCount === 0 &&
    results &&
    results[0] &&
    results[0].messages[0].message.includes('Use "--no-ignore" to override.')
  );
};

const runESLint = ({ testPath, config }, workerCallback) => {
  try {
    const start = +new Date();
    const { CLIEngine } = getLocalESLint(config);
    const cli = new CLIEngine({});
    const report = cli.executeOnFiles([testPath]);
    const end = +new Date();

    const formatter = cli.getFormatter();
    if (isFileIgnored(report)) {
      workerCallback(
        null,
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
        }),
      );
    } else if (report.errorCount > 0) {
      const errorMessage = formatter(CLIEngine.getErrorResults(report.results));
      workerCallback(
        null,
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
        }),
      );
    } else {
      workerCallback(
        null,
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
        }),
      );
    }
  } catch (e) {
    workerCallback(e);
  }
};

module.exports = runESLint;
