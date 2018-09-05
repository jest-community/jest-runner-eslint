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
  const cli = new CLIEngine(
    Object.assign({}, options.cliOptions, {
      fix:
        options.cliOptions &&
        (options.cliOptions.fix || options.cliOptions.fixDryRun),
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

  if (report.errorCount > 0 || tooManyWarnings) {
    const formatter = cli.getFormatter(options.cliOptions.format);
    let errorMessage = formatter(CLIEngine.getErrorResults(report.results));

    if (!report.errorCount && tooManyWarnings)
      errorMessage += `\nESLint found too many warnings (maximum: ${options
        .cliOptions.maxWarnings}).`;

    return fail({
      start,
      end,
      test: { path: testPath, title: 'ESLint', errorMessage },
    });
  }

  return pass({ start, end, test: { path: testPath, title: 'ESLint' } });
};

module.exports = runESLint;
