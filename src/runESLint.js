const { pass, fail, skip } = require('create-jest-runner');
const getLocalESLint = require('./utils/getLocalESLint');
const getESLintOptions = require('./utils/getESLintOptions');

const runESLint = ({ testPath, config }) => {
  const start = Date.now();

  if (config.setupTestFrameworkScriptFile) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(config.setupTestFrameworkScriptFile);
  }

  const { CLIEngine } = getLocalESLint(config);
  const { cliOptions } = getESLintOptions(config);
  const { quiet } = cliOptions;
  const cli = new CLIEngine(
    Object.assign({}, cliOptions, {
      fix:
        (cliOptions.fix || cliOptions.fixDryRun) &&
        (quiet ? ({ severity }) => severity === 2 : true),
    }),
  );
  if (cli.isPathIgnored(testPath)) {
    const end = Date.now();
    return skip({ start, end, test: { path: testPath, title: 'ESLint' } });
  }

  const report = cli.executeOnFiles([testPath]);

  if (cliOptions.fix && !cliOptions.fixDryRun) {
    CLIEngine.outputFixes(report);
  }

  const end = Date.now();

  const tooManyWarnings =
    cliOptions.maxWarnings >= 0 && report.warningCount > cliOptions.maxWarnings;

  const format = () => {
    const formatter = cli.getFormatter(cliOptions.format);
    return formatter(
      quiet ? CLIEngine.getErrorResults(report.results) : report.results,
    );
  };

  if (report.errorCount > 0 || tooManyWarnings) {
    let errorMessage = format();

    if (!report.errorCount && tooManyWarnings)
      errorMessage += `\nESLint found too many warnings (maximum: ${
        cliOptions.maxWarnings
      }).`;

    return fail({
      start,
      end,
      test: { path: testPath, title: 'ESLint', errorMessage },
    });
  }

  const result = pass({
    start,
    end,
    test: { path: testPath, title: 'ESLint' },
  });

  if (!quiet && report.warningCount > 0) {
    result.console = [{ message: format(), origin: '', type: 'warn' }];
  }

  return result;
};

module.exports = runESLint;
