const throat = require('throat');
const Worker = require('jest-worker').default;
const path = require('path');

const TEST_WORKER_PATH = path.join(__dirname, 'runESLint.js');

class CancelRun extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancelRun';
  }
}

module.exports = class ESLintTestRunner {
  constructor(globalConfig) {
    this._globalConfig = globalConfig;
  }

  // eslint-disable-next-line
  async runTests(tests, watcher, onStart, onResult, onFailure) {
    const worker = new Worker(require.resolve(TEST_WORKER_PATH), {
      maxRetries: 2,
      maxWorkers: this._globalConfig.maxWorkers,
    });

    const mutex = throat(this._globalConfig.maxWorkers);

    const runTestInWorker = test =>
      mutex(async () => {
        if (watcher.isInterrupted()) {
          throw new CancelRun();
        }
        await onStart(test);
        return worker.runESLint({
          config: test.context.config,
          testPath: test.path,
        });
      });

    const onError = async (err, test) => {
      await onFailure(test, err);
      if (err.type === 'ProcessTerminatedError') {
        // eslint-disable-next-line no-console
        console.error(
          'A worker process has quit unexpectedly! ' +
            'Most likely this is an initialization error.',
        );
        process.exit(1);
      }
    };

    const onInterrupt = new Promise((_, reject) => {
      watcher.on('change', state => {
        if (state.interrupted) {
          reject(new CancelRun());
        }
      });
    });

    const runAllTests = Promise.all(
      tests.map(test =>
        runTestInWorker(test)
          .then(testResult => onResult(test, testResult))
          .catch(error => onError(error, test)),
      ),
    );

    const cleanup = () => worker.end();

    return Promise.race([runAllTests, onInterrupt]).then(cleanup, cleanup);
  }
};
