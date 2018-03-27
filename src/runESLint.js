const createJestRunner = require('create-jest-runner');
const getLocalESLint = require('./utils/getLocalESLint');
const getESLintOptions = require('./utils/getESLintOptions');

const pass = createJestRunner.pass;
const fail = createJestRunner.fail;
const skip = createJestRunner.skip;

const runESLint = ({ testPath, config }) => {
  const start = +new Date();

  if (config.setupTestFrameworkScriptFile) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(config.setupTestFrameworkScriptFile);
  }

  const { CLIEngine } = getLocalESLint(config);
  const options = getESLintOptions(config);
  const cli = new CLIEngine(options.cliOptions);
  if (cli.isPathIgnored(testPath)) {
    const end = +new Date();
    skip({ start, end, testPath });
  } else {
    const report = cli.executeOnFiles([testPath]);

    if (options.cliOptions && options.cliOptions.fix) {
      CLIEngine.outputFixes(report);
    }

    const end = +new Date();

    if (report.errorCount > 0) {
      const formatter = cli.getFormatter(options.cliOptions.format);
      const errorMessage = formatter(CLIEngine.getErrorResults(report.results));

      fail({ start, end, testPath, errorMessage });
    } else {
      pass({ start, end, testPath });
    }
  }
};

module.exports = runESLint;
