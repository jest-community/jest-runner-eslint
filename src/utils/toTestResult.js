const formatMochaError = require('../internal/formatMochaError');

const hasError = (test = {}) => {
  return (
    test.err instanceof Error || (test.err && Object.keys(test.err).length > 0)
  );
};
const toMochaError = test =>
  hasError(test) ? `\n${formatMochaError(test)}\n\n` : null;

const toTestResult = ({ stats, tests, jestTestPath, coverage }) => {
  return {
    coverage,
    console: null,
    failureMessage: toMochaError(tests.find(hasError)),
    numFailingTests: stats.failures,
    numPassingTests: stats.passes,
    numPendingTests: stats.pending,
    perfStats: {
      end: +new Date(stats.end),
      start: +new Date(stats.start),
    },
    skipped: false,
    snapshot: {
      added: 0,
      fileDeleted: false,
      matched: 0,
      unchecked: 0,
      unmatched: 0,
      updated: 0,
    },
    sourceMaps: {},
    testExecError: null,
    testFilePath: jestTestPath,
    testResults: tests.map(test => {
      return {
        ancestorTitles: [],
        duration: test.duration / 1000,
        failureMessages: toMochaError(test),
        fullName: test.fullTitle(),
        numPassingAsserts: hasError(test) ? 1 : 0,
        status: hasError(test) ? 'failed' : 'passed',
        title: test.title,
      };
    }),
  };
};

module.exports = toTestResult;
