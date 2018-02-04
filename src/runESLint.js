const getLocalESLint = require('./utils/getLocalESLint');
const getESLintOptions = require('./utils/getESLintOptions');
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

module.exports.runESLint = ({ testPath, config }) => {
  const start = Date.now();

  if (config.setupTestFrameworkScriptFile) {
    require(config.setupTestFrameworkScriptFile);
  }

  const { CLIEngine } = getLocalESLint(config);
  const options = getESLintOptions(config);
  const cli = new CLIEngine(options.cliOptions);
  if (cli.isPathIgnored(testPath)) {
    const end = Date.now();
    return skip({ start, end, testPath });
  }
  const report = cli.executeOnFiles([testPath]);

  if (options.cliOptions && options.cliOptions.fix) {
    CLIEngine.outputFixes(report);
  }

  const end = Date.now();

  if (report.errorCount > 0) {
    const formatter = cli.getFormatter(options.cliOptions.format);
    const errorMessage = formatter(CLIEngine.getErrorResults(report.results));
    return fail({ start, end, testPath, errorMessage });
  }
  return pass({ start, end, testPath });
};
