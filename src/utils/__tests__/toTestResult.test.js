const toTestResult = require('../toTestResult');

const jestTestPath = 'path/to/file';
const start = Date.UTC(2000, 0, 1, 0, 0, 0, 0);
const end = start + 1000;

const passingTest = {
  duration: 1,
  title: 'This test passes[1]',
  fullTitle: () => 'This test passes[1]',
};

const passingTest2 = {
  duration: 4,
  title: 'This test also passes[2]',
  fullTitle: () => 'This test also passes[2]',
};

const failingTest = {
  duration: 4,
  err: {
    stack: 'Error stack',
    message: 'The error message',
    showDiff: true,
    expected: 1,
    actual: 2,
  },
  title: 'This test failed',
  fullTitle: () => 'This test failed',
};

it('turns a passing mocha tests to Jest test result', () => {
  expect(
    toTestResult({
      jestTestPath,
      stats: {
        start,
        end,
        passes: 1,
        pending: 0,
        failures: 0,
      },
      tests: [passingTest],
    }),
  ).toMatchSnapshot();
});

it('turns a passing mocha tests to Jest test result with coverage', () => {
  expect(
    toTestResult({
      jestTestPath,
      coverage: { mocked: 'coverageData' },
      stats: {
        start,
        end,
        passes: 1,
        pending: 0,
        failures: 0,
      },
      tests: [passingTest],
    }),
  ).toMatchSnapshot();
});

it('turns a failing mocha tests to Jest test result', () => {
  expect(
    toTestResult({
      jestTestPath,
      stats: {
        start,
        end,
        passes: 0,
        pending: 0,
        failures: 1,
      },
      tests: [failingTest],
    }),
  ).toMatchSnapshot();
});

it('turns a whole mocha tests suite to Jest test result', () => {
  expect(
    toTestResult({
      jestTestPath,
      stats: {
        start,
        end,
        passes: 1,
        pending: 0,
        failures: 0,
      },
      tests: [passingTest, passingTest2, failingTest],
    }),
  ).toMatchSnapshot();
});
