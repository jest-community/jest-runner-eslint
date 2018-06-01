const { pass, fail, skip } = require('create-jest-runner');
const getLocalESLint = require('../utils/getLocalESLint');
const getESLintOptions = require('../utils/getESLintOptions');

const runESLint = ({ testPath, config, extraOptions }) => {
  const start = Date.now();

  if (config.setupTestFrameworkScriptFile) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(config.setupTestFrameworkScriptFile);
  }

  const { CLIEngine } = getLocalESLint(config);
  const options = getESLintOptions(
    config,
    extraOptions
      ? {
          cliOptions: extraOptions.configOverrides,
        }
      : {},
  );
  const cli = new CLIEngine(options.cliOptions);
  if (cli.isPathIgnored(testPath)) {
    const end = Date.now();
    return skip({ start, end, test: { path: testPath, title: 'ESLint' } });
  }

  const report = cli.executeOnFiles([testPath]);

  if (options.cliOptions && options.cliOptions.fix) {
    CLIEngine.outputFixes(report);
  }

  const end = Date.now();

  if (report.errorCount > 0) {
    const formatter = cli.getFormatter(options.cliOptions.format);
    const errorMessage = formatter(CLIEngine.getErrorResults(report.results));

    return fail({
      start,
      end,
      test: { path: testPath, title: 'ESLint', errorMessage },
    });
  }

  return pass({ start, end, test: { path: testPath, title: 'ESLint' } });
};

module.exports = runESLint;
