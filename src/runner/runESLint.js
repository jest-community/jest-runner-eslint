const { fail } = require('create-jest-runner');
const { CLIEngine, ESLint } = require('eslint');
const getESLintOptions = require('../utils/getESLintOptions');

/*
 * This function exists because there are issues with the `pass` and `fail`
 * functions from `create-jest-runner`:
 *
 * 1. The `pass` function has a bug in our version of `create-jest-runner` where
 *    calling it will actually pass an `undefined` item in `testResults`, which
 *    causes the GithubActionsReporter to report an empty error message on every
 *    file.  This has been resolved in later versions of `create-jest-runner`,
 *    but upgrading is a breaking change that is incompatible with some node
 *    versions we support.
 *
 * 2. The `fail` function in `create-jest-runner` does not support passing
 *    multiple failure messages, which makes it impossible to annotate each
 *    eslint failure.  This has not been resolved, although presumably could be
 *    worked around by using the underlying `toTestResult` function instead.
 *
 * TODO At some point, we should put a PR in to `create-jest-runner` to resolve
 * point 2 above, and then should upgrade and remove this function and go back
 * to using `pass` and `fail` from that library instead.
 */
const mkTestResults = ({
  message,
  start,
  end,
  numFailingTests,
  numPassingTests,
  testPath,
  testResults,
}) => {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  return {
    failureMessage: message,
    leaks: false,
    numFailingTests,
    numPassingTests,
    numPendingTests: 0,
    numTodoTests: 0,
    openHandles: [],
    perfStats: {
      start: startTime,
      end: endTime,
      duration: endTime - startTime,
      slow: false,
    },
    skipped: numPassingTests === 0 && numFailingTests === 0,
    snapshot: {
      added: 0,
      fileDeleted: false,
      matched: 0,
      unchecked: 0,
      uncheckedKeys: [],
      unmatched: 0,
      updated: 0,
    },
    testFilePath: testPath,
    testResults: testResults.map(result => ({
      duration: endTime - startTime,
      ancestorTitles: [],
      failureDetails: [],
      failureMessages: result.message ? [result.message] : [],
      fullName: result.fullName,
      location: result.location,
      testFilePath: testPath,
      numPassingAsserts: 0,
      status: result.status,
      title: result.title,
    })),
  };
};

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
        format,
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

  if (config.setupFilesAfterEnv) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    config.setupFilesAfterEnv.forEach(require);
  }

  const { isPathIgnored, lintFiles, formatter, cliOptions } = getCachedValues(
    config,
    extraOptions,
  );

  if (await isPathIgnored(testPath)) {
    return mkTestResults({
      start,
      end: Date.now(),
      testPath,
      numFailingTests: 0,
      numPassingTests: 0,
      testResults: [
        {
          title: 'ESLint',
          status: 'skipped',
        },
      ],
    });
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
    return mkTestResults({
      message,
      start,
      end,
      testPath,
      numFailingTests: report[0].errorCount,
      numPassingTests: 0,
      testResults:
        report[0].messages?.map(reportMessage => ({
          message: [
            reportMessage.message,
            `    at ${testPath}:${reportMessage.line}:${reportMessage.column}`,
          ].join('\n'),
          fullName: `${reportMessage.line}:${reportMessage.column}: ${reportMessage.message} [${reportMessage.ruleId}]`,
          location: {
            column: reportMessage.line,
            line: reportMessage.column,
          },
          status: 'failed',
          title: reportMessage.ruleId,
        })) ?? [],
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

  const result = mkTestResults({
    start,
    end,
    testPath,
    numFailingTests: 0,
    numPassingTests: 1,
    testResults: [
      {
        title: 'ESLint',
        status: 'passed',
      },
    ],
  });

  if (!cliOptions.quiet && report[0]?.warningCount > 0) {
    result.console = [{ message, origin: '', type: 'warn' }];
  }

  return result;
};

module.exports = runESLint;
