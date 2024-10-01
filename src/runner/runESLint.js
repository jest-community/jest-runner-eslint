const eslint = require('eslint');
const getESLintOptions = require('../utils/getESLintOptions');

const { ESLint } = eslint;
let { loadESLint } = eslint;

// loadESLint and ESLint.configType were added in eslint v8.57.0.  The block
// below is some compat code to make this library work with flat config and
// versions of eslint prior to 8.57.0.
if (!loadESLint) {
  try {
    const {
      FlatESLint,
      shouldUseFlatConfig,
      // eslint-disable-next-line global-require, import/no-unresolved
    } = require('eslint/use-at-your-own-risk');
    FlatESLint.configType = 'flat';
    loadESLint = async () =>
      (await shouldUseFlatConfig?.()) ? FlatESLint : ESLint;
  } catch {
    /* no-op */
  }
}

/*
 * This function exists because there are issues with the `pass`, `skip`, and
 * `fail` functions from `create-jest-runner`:
 *
 * 1. The `pass` and `skip` functions have a bug in our version of
 *    `create-jest-runner` where calling them will actually pass an `undefined`
 *    item in `testResults`, which causes the GithubActionsReporter to report an
 *    empty error message on every file.  This has been resolved in later
 *    versions of `create-jest-runner`, but upgrading is a breaking change that
 *    is incompatible with some node versions we support.
 *
 * 2. The `fail` function in `create-jest-runner` does not support passing
 *    multiple failure messages, which makes it impossible to annotate each
 *    eslint failure.  This has not been resolved, although presumably could be
 *    worked around by using the underlying `toTestResult` function instead
 *    (although that function isn't exposed in the public API of that library).
 *
 * TODO At some point, we should put a PR in to `create-jest-runner` to resolve
 * point 2 above, and then should upgrade and remove this function and go back
 * to using `pass`, `skip`, and `fail` from that library instead.
 */
const mkTestResults = ({
  message,
  start,
  end,
  numFailingTests,
  numPassingTests,
  testPath,
  assertionResults,
  cliOptions,
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
      runtime: endTime - startTime,
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
    testResults: assertionResults.map(result => ({
      duration: endTime - startTime,
      ancestorTitles: [],
      failureDetails: [],
      failureMessages: result.message ? [result.message] : [],
      fullName: result.fullName,
      location: result.location,
      testFilePath: testPath,
      numPassingAsserts: numPassingTests,
      status: result.status,
      title: result.title,
    })),
    cliOptions,
  };
};

const mkAssertionResults = (testPath, report) =>
  report[0].messages?.map(reportMessage => ({
    message: [
      reportMessage.message,
      `    at ${testPath}:${reportMessage.line}:${reportMessage.column}`,
    ].join('\n'),
    fullName: `${reportMessage.line}:${reportMessage.column}: ${reportMessage.message} [${reportMessage.ruleId}]`,
    location: {
      column: reportMessage.column,
      line: reportMessage.line,
    },
    status: 'failed',
    title: reportMessage.ruleId,
  })) ?? [];

const getComputedFixValue = ({ fix, quiet, fixDryRun }) => {
  if (fix || fixDryRun) {
    return quiet ? ({ severity }) => severity === 2 : true;
  }
  return undefined;
};

function removeUndefinedFromObject(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => typeof value !== 'undefined'),
  );
}

let cachedValues;
const getCachedValues = async (config, extraOptions) => {
  if (!cachedValues) {
    const ESLintConstructor = (await loadESLint?.()) ?? ESLint;

    const { cliOptions: baseCliOptions } = getESLintOptions(
      ESLintConstructor.configType,
      config,
    );
    const cliOptions = {
      ...baseCliOptions,
      fix: getComputedFixValue(baseCliOptions),
      ...removeUndefinedFromObject(extraOptions),
    };

    // Remove options that are not constructor args.
    const { fixDryRun, format, maxWarnings, quiet, ...constructorArgs } =
      cliOptions;

    const cli = new ESLintConstructor(constructorArgs);

    cachedValues = {
      isPathIgnored: cli.isPathIgnored.bind(cli),
      lintFiles: (...args) => cli.lintFiles(...args),
      formatter: async (...args) => {
        const formatter = await cli.loadFormatter(cliOptions.format);
        return formatter.format(...args);
      },
      cliOptions,
      ESLintConstructor,
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

  const { isPathIgnored, lintFiles, formatter, cliOptions, ESLintConstructor } =
    await getCachedValues(config, extraOptions);

  if (await isPathIgnored(testPath)) {
    return mkTestResults({
      start,
      end: Date.now(),
      testPath,
      numFailingTests: 0,
      numPassingTests: 0,
      assertionResults: [
        {
          title: 'ESLint',
          status: 'skipped',
        },
      ],
    });
  }

  const report = await lintFiles([testPath]);

  if (cliOptions.fix && !cliOptions.fixDryRun) {
    await ESLintConstructor.outputFixes(report);
  }

  const end = Date.now();

  const eslintReport = cliOptions.quiet
    ? ESLintConstructor.getErrorResults(report)
    : report;
  const message = await formatter(eslintReport);

  if (eslintReport[0]?.errorCount > 0) {
    return mkTestResults({
      message,
      start,
      end,
      testPath,
      numFailingTests: eslintReport[0].errorCount,
      numPassingTests: 0,
      assertionResults: mkAssertionResults(testPath, eslintReport),
      cliOptions,
    });
  }

  const tooManyWarnings =
    cliOptions.maxWarnings >= 0 &&
    report[0]?.warningCount > cliOptions.maxWarnings;
  if (tooManyWarnings) {
    return mkTestResults({
      message: `${message}\nESLint found too many warnings (maximum: ${cliOptions.maxWarnings}).`,
      start,
      end,
      testPath,
      numFailingTests: 1,
      numPassingTests: 0,
      assertionResults: mkAssertionResults(testPath, report),
      cliOptions,
    });
  }

  const result = mkTestResults({
    start,
    end,
    testPath,
    numFailingTests: 0,
    numPassingTests: 1,
    assertionResults: [
      {
        title: 'ESLint',
        status: 'passed',
      },
    ],
    cliOptions,
  });

  if (!cliOptions.quiet && report[0]?.warningCount > 0) {
    result.console = [{ message, origin: '', type: 'warn' }];
  }

  return result;
};

module.exports = runESLint;
