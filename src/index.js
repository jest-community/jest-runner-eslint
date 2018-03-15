const throat = require('throat');
const pify = require('pify');
const workerFarm = require('worker-farm');
const path = require('path');
const lint = require('./runESLint');

const TEST_WORKER_PATH = path.join(__dirname, 'runESLint.js');

class CancelRun extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancelRun';
  }
}

async function runTestsSerial(tests, watcher, onStart, onResult, onFailure) {
  const runner = async test => {
    return onStart(test).then(() => {
      return new Promise((resolve, reject) => {
        lint(
          { testPath: test.path, config: test.context.config },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      });
    });
  };
  return Promise.all(
    tests.map(test =>
      runner(test)
        .then(testResult => onResult(test, testResult))
        .catch(error => onFailure(test, error)),
    ),
  );
}

module.exports = class ESLintTestRunner {
  constructor(globalConfig) {
    this._globalConfig = globalConfig;
  }

  async runTests(tests, watcher, onStart, onResult, onFailure, opts) {
    if (opts && opts.serial) {
      return runTestsSerial(tests, watcher, onStart, onResult, onFailure);
    }
    const farm = workerFarm(
      {
        autoStart: true,
        maxConcurrentCallsPerWorker: 1,
        maxConcurrentWorkers: this._globalConfig.maxWorkers,
        maxRetries: 2, // Allow for a couple of transient errors.
      },
      TEST_WORKER_PATH,
    );

    const mutex = throat(this._globalConfig.maxWorkers);
    const worker = pify(farm);

    const runTestInWorker = test =>
      mutex(async () => {
        if (watcher.isInterrupted()) {
          throw new CancelRun();
        }
        await onStart(test);
        return worker({
          config: test.context.config,
          globalConfig: this._globalConfig,
          testPath: test.path,
          rawModuleMap: watcher.isWatchMode()
            ? test.context.moduleMap.getRawModuleMap()
            : null,
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

    const cleanup = () => workerFarm.end(farm);

    return Promise.race([runAllTests, onInterrupt]).then(cleanup, cleanup);
  }
};
