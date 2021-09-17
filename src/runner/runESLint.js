const { pass, fail, skip } = require('create-jest-runner');
const { CLIEngine, ESLint } = require('eslint');
const getESLintOptions = require('../utils/getESLintOptions');

const getComputedFixValue = ({ fix, quiet, fixDryRun }) => {
  if (fix || fixDryRun) {
    return quiet ? ({ severity }) => severity === 2 : true;
  }
  return undefined;
};

const ESLintEngine = ESLint || CLIEngine;

let cachedValues;
const getCachedValues = (config, extraOptions) => {
  if (!cachedValues) {
    const useEngine = ESLint == null;
    const { cliOptions: baseCliOptions } = getESLintOptions(config, !useEngine);
    const cliOptions = {
      ...baseCliOptions,
      fix: getComputedFixValue(baseCliOptions),
      ...extraOptions,
    };

    // these are not constructor args, so remove them
    const { fixDryRun, format, maxWarnings, quiet } = cliOptions;
    delete cliOptions.fixDryRun;
    delete cliOptions.format;
    delete cliOptions.maxWarnings;
    delete cliOptions.quiet;

    const cli = useEngine ? new CLIEngine(cliOptions) : new ESLint(cliOptions);

    cachedValues = {
      isPathIgnored: cli.isPathIgnored.bind(cli),
      lintFiles: (...args) => {
        if (useEngine) {
          return cli.executeOnFiles(...args).results;
        }

        return cli.lintFiles(...args);
      },
      formatter: async (...args) => {
        if (useEngine) {
          return cli.getFormatter(format)(...args);
        }

        const formatter = await cli.loadFormatter(format);

        return formatter.format(...args);
      },
      cliOptions: {
        ...cliOptions,
        fixDryRun,
        maxWarnings,
        quiet,
      },
    };
  }

  return cachedValues;
};

const runESLint = async ({ testPath, config, extraOptions }) => {
  const start = Date.now();

  if (config.setupTestFrameworkScriptFile) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(config.setupTestFrameworkScriptFile);
  }

  const { isPathIgnored, lintFiles, formatter, cliOptions } = getCachedValues(
    config,
    extraOptions,
  );

  if (await isPathIgnored(testPath)) {
    const end = Date.now();
    return skip({ start, end, test: { path: testPath, title: 'ESLint' } });
  }

  const report = await lintFiles([testPath]);

  if (cliOptions.fix && !cliOptions.fixDryRun) {
    await ESLintEngine.outputFixes(report);
  }

  const end = Date.now();

  const message = await formatter(
    cliOptions.quiet ? ESLintEngine.getErrorResults(report) : report,
  );

  if (report[0]?.errorCount > 0) {
    return fail({
      start,
      end,
      test: { path: testPath, title: 'ESLint', errorMessage: message },
    });
  }

  const tooManyWarnings =
    cliOptions.maxWarnings >= 0 &&
    report[0]?.warningCount > cliOptions.maxWarnings;
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

  if (!cliOptions.quiet && report[0]?.warningCount > 0) {
    result.console = [{ message, origin: '', type: 'warn' }];
  }

  return result;
};

module.exports = runESLint;
