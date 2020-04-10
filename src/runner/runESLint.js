const { pass, fail, skip } = require('create-jest-runner');
const { CLIEngine } = require('eslint');
const getESLintOptions = require('../utils/getESLintOptions');

const getComputedFixValue = ({ fix, quiet, fixDryRun }) => {
  if (fix || fixDryRun) {
    return quiet ? ({ severity }) => severity === 2 : true;
  }
  return undefined;
};

let cachedValues;
const getCachedValues = (config, extraOptions) => {
  if (!cachedValues) {
    const { cliOptions: baseCliOptions } = getESLintOptions(config);
    const cliOptions = {
      ...baseCliOptions,
      fix: getComputedFixValue(baseCliOptions),
      ...extraOptions,
    };
    const cli = new CLIEngine(cliOptions);
    const formatter = cli.getFormatter(cliOptions.format);

    cachedValues = { cli, formatter, cliOptions };
  }

  return cachedValues;
};

const runESLint = ({ testPath, config, extraOptions }) => {
  const start = Date.now();

  if (config.setupTestFrameworkScriptFile) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(config.setupTestFrameworkScriptFile);
  }

  const { cli, formatter, cliOptions } = getCachedValues(config, extraOptions);

  if (cli.isPathIgnored(testPath)) {
    const end = Date.now();
    return skip({ start, end, test: { path: testPath, title: 'ESLint' } });
  }

  const report = cli.executeOnFiles([testPath]);

  if (cliOptions.fix && !cliOptions.fixDryRun) {
    CLIEngine.outputFixes(report);
  }

  const end = Date.now();

  const message = formatter(
    cliOptions.quiet
      ? CLIEngine.getErrorResults(report.results)
      : report.results,
  );

  if (report.errorCount > 0) {
    return fail({
      start,
      end,
      test: { path: testPath, title: 'ESLint', errorMessage: message },
    });
  }

  const tooManyWarnings =
    cliOptions.maxWarnings >= 0 && report.warningCount > cliOptions.maxWarnings;
  if (tooManyWarnings) {
    return fail({
      start,
      end,
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: `${message}\nESLint found too many warnings (maximum: ${cliOptions.maxWarnings}).`,
      },
    });
  }

  const result = pass({
    start,
    end,
    test: { path: testPath, title: 'ESLint' },
  });

  if (!cliOptions.quiet && report.warningCount > 0) {
    result.console = [{ message, origin: '', type: 'warn' }];
  }

  return result;
};

module.exports = runESLint;
