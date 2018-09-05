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
  const options = getESLintOptions(config);
  const quiet = options.cliOptions && options.cliOptions.quiet;
  const cli = new CLIEngine(
    Object.assign({}, options.cliOptions, {
      fix:
        options.cliOptions &&
        (options.cliOptions.fix || options.cliOptions.fixDryRun) &&
        (quiet ? ({ severity }) => severity === 2 : true),
    }),
  );
  if (cli.isPathIgnored(testPath)) {
    const end = Date.now();
    return skip({ start, end, test: { path: testPath, title: 'ESLint' } });
  }

  const report = cli.executeOnFiles([testPath]);

  if (
    options.cliOptions &&
    options.cliOptions.fix &&
    !options.cliOptions.fixDryRun
  ) {
    CLIEngine.outputFixes(report);
  }

  const end = Date.now();

  const tooManyWarnings =
    options.cliOptions &&
    options.cliOptions.maxWarnings != null &&
    options.cliOptions.maxWarnings >= 0 &&
    report.warningCount > options.cliOptions.maxWarnings;

  const format = () => {
    const formatter = cli.getFormatter(options.cliOptions.format);
    return formatter(
      quiet ? CLIEngine.getErrorResults(report.results) : report.results,
    );
  };

  if (report.errorCount > 0 || tooManyWarnings) {
    let errorMessage = format();

    if (!report.errorCount && tooManyWarnings)
      errorMessage += `\nESLint found too many warnings (maximum: ${options
        .cliOptions.maxWarnings}).`;

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
