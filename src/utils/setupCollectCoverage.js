const minimatch = require('minimatch');

const setupCollectCoverage = ({
  rootDir,
  collectCoverage,
  coveragePathIgnorePatterns,
}) => {
  if (!collectCoverage) {
    return;
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const register = require('babel-register');
  register({
    plugins: [
      [
        'babel-plugin-istanbul',
        {
          // files outside `cwd` will not be instrumented
          cwd: rootDir,
          useInlineSourceMaps: false,
          exclude: coveragePathIgnorePatterns,
        },
      ],
    ],
    ignore: filename => {
      return (
        /node_modules/.test(filename) ||
        coveragePathIgnorePatterns.some(pattern => minimatch(filename, pattern))
      );
    },
    babelrc: false,
    // compact: true,
    retainLines: true,
    sourceMaps: 'inline',
  });
};

module.exports = setupCollectCoverage;
