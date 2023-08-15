const { ESLint } = require('eslint');
const getESLintOptions = require('../utils/getESLintOptions');

let FlatESLint;
let shouldUseFlatConfig;

try {
  // Use a dynamic require here rather than a global require because this
  // import path does not exist in eslint v7 which this library still
  // supports
  //
  // ESlint exposes the new FlatESLint API under `eslint/use-at-your-own-risk` by
  // using it's [export configuration](https://tinyurl.com/2s45zh9b).  However,
  // the `import/no-unresolved` rule is [not aware of
  // `exports`](https://tinyurl.com/469djpx3) and causes a false error here.  So,
  // let's ignore that rule for this import.
  //
  // eslint-disable-next-line global-require, import/no-unresolved
  const eslintExperimental = require('eslint/use-at-your-own-risk');
  FlatESLint = eslintExperimental.FlatESLint;
  shouldUseFlatConfig = eslintExperimental.shouldUseFlatConfig;
} catch {
  /* no-op */
}

if (shouldUseFlatConfig === undefined) {
  shouldUseFlatConfig = () => Promise.resolve(false);
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
      column: reportMessage.line,
      line: reportMessage.column,
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
  return Object.fromEntries(Object.entries(object).filter(([, value]) => typeof value !== 'undefined'));
};

const getESLintConstructor = async () => {
  if (await shouldUseFlatConfig()) {
    return FlatESLint;
  }

  return ESLint;
};

// Remove options that are not constructor args.
const getESLintConstructorArgs = async cliOptions => {
  // these are not constructor args for either the legacy or the flat ESLint
  // api
  const { fixDryRun, format, maxWarnings, quiet, ...legacyConstructorArgs } =
    cliOptions;

  if (await shouldUseFlatConfig()) {
    // these options are supported by the legacy ESLint api but aren't
    // supported by the ESLintFlat api
    const {
      extensions,
      ignorePath,
      rulePaths,
      resolvePluginsRelativeTo,
      useEslintrc,
      overrideConfig,
      ...flatConstructorArgs
    } = legacyConstructorArgs;
    return flatConstructorArgs;
  }

  return legacyConstructorArgs;
};

let cachedValues;
const getCachedValues = async (config, extraOptions) => {
  if (!cachedValues) {
    const { cliOptions: baseCliOptions } = getESLintOptions(config);
    const cliOptions = {
      ...baseCliOptions,
      fix: getComputedFixValue(baseCliOptions),
      ...removeUndefinedFromObject(extraOptions),
    };

    const ESLintConstructor = await getESLintConstructor();
    const cli = new ESLintConstructor(
      await getESLintConstructorArgs(cliOptions),
    );

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

  const message = await formatter(
    cliOptions.quiet ? ESLintConstructor.getErrorResults(report) : report,
  );

  if (report[0]?.errorCount > 0) {
    return mkTestResults({
      message,
      start,
      end,
      testPath,
      numFailingTests: report[0].errorCount,
      numPassingTests: 0,
      assertionResults: mkAssertionResults(testPath, report),
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
  });

  if (!cliOptions.quiet && report[0]?.warningCount > 0) {
    result.console = [{ message, origin: '', type: 'warn' }];
  }

  return result;
};

module.exports = runESLint;
