[![Build Status](https://travis-ci.org/jest-community/jest-runner-eslint.svg?branch=master)](https://travis-ci.org/jest-community/jest-runner-eslint) [![npm version](https://badge.fury.io/js/jest-runner-eslint.svg)](https://badge.fury.io/js/jest-runner-eslint)

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img width="150" height="150" src="https://cdn.worldvectorlogo.com/logos/eslint.svg">
  <a href="https://facebook.github.io/jest/">
    <img width="150" height="150" vspace="" hspace="25" src="https://cdn.worldvectorlogo.com/logos/jest-0.svg">
  </a>
  <h1>jest-runner-eslint</h1>
  <p>ESLint runner for Jest</p>
</div>

<div align="center">
  <img src="https://user-images.githubusercontent.com/574806/30197438-9681385c-941c-11e7-80a8-2b11f15bd412.gif">
</div>

## Usage

### Install

Install `jest`_(it needs Jest 21+)_ and `jest-runner-eslint`

```bash
yarn add --dev jest jest-runner-eslint

# or with NPM

npm install --save-dev jest jest-runner-eslint
```

### Add it to your Jest config

#### Standalone

In your `package.json`

```json
{
  "jest": {
    "runner": "jest-runner-eslint",
    "displayName": "lint",
    "testMatch": ["<rootDir>/src/**/*.js"]
  }
}
```

Or in `jest.config.js`

```js
module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'lint',
  testMatch: ['<rootDir>/src/**/*.js'],
};
```

Please update `testMatch` to match your project folder structure

#### Alongside other runners

It is recommended to use the [`projects`](https://facebook.github.io/jest/docs/en/configuration.html#projects-array-string-projectconfig) configuration option to run multiple Jest runners simultaneously.

If you are using Jest <22.0.5, you can use multiple Jest configuration files and supply the paths to those files in the `projects` option. For example:

```js
// jest-test.config.js
module.exports = {
  // your Jest test options
  displayName: 'test',
};

// jest-eslint.config.js
module.exports = {
  // your jest-runner-eslint options
  runner: 'jest-runner-eslint',
  displayName: 'lint',
  testMatch: ['<rootDir>/src/**/*.js'],
};
```

In your `package.json`:

```json
{
  "jest": {
    "projects": [
      "<rootDir>/jest-test.config.js",
      "<rootDir>/jest-eslint.config.js"
    ]
  }
}
```

Or in `jest.config.js`:

```js
module.exports = {
  projects: [
    '<rootDir>/jest-test.config.js',
    '<rootDir>/jest-eslint.config.js',
  ],
};
```

If you are using Jest >=22.0.5, you can supply an array of project configuration objects instead. In your `package.json`:

```json
{
  "jest": {
    "projects": [
      {
        "displayName": "test"
      },
      {
        "runner": "jest-runner-eslint",
        "displayName": "lint",
        "testMatch": ["<rootDir>/src/**/*.js"]
      }
    ]
  }
}
```

Or in `jest.config.js`:

```js
module.exports = {
  projects: [
    {
      displayName: 'test',
    },
    {
      runner: 'jest-runner-eslint',
      displayName: 'lint',
      testMatch: ['<rootDir>/src/**/*.js'],
    },
  ],
};
```

### Run Jest

```bash
yarn jest
```

## Toggle `--fix` in watch mode

`jest-eslint-runner` comes with a watch plugin that allows you to toggle the `--fix` value while in watch mode without having to update your configuration.

![fix](https://user-images.githubusercontent.com/574806/46181271-93205080-c279-11e8-8d73-b4c5e11086c4.gif)

To use this watch plugin simply add this to your Jest configuration.

```js
{
  watchPlugins: ['jest-runner-eslint/watch-fix'],
}
```

After this run Jest in watch mode and you will see the following line in your watch usage menu

```
 › Press F to override ESLint --fix.
```

## Options

This project uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig), so you can provide config via:

- a `jest-runner-eslint` property in your `package.json`
- a `jest-runner-eslint.config.js` JS file
- a `.jest-runner-eslintrc` JSON file

In `package.json`

```json
{
  "jest-runner-eslint": {
    "cliOptions": {
      // Options here
    }
  }
}
```

or in `jest-runner-eslint.config.js`

```js
module.exports = {
  cliOptions: {
    // Options here
  },
};
```

### cliOptions

jest-runner-eslint maps a lot of ESLint CLI arguments to config options. For example `--fix` is `cliOptions.fix`

| option                        | default        | example                                                                                       |
| ----------------------------- | -------------- | --------------------------------------------------------------------------------------------- |
| cache                         | `false`        | `"cache": true`                                                                               |
| cacheLocation                 | `.eslintcache` | `"cacheLocation": "/path/to/cache"`                                                           |
| config                        | `null`         | `"config": "/path/to/config"`                                                                 |
| env                           | `null`         | `"env": "mocha"` or `"env": ["mocha", "other"]`                                               |
| ext                           | `[".js"]`      | `"ext": ".jsx"` or `"ext": [".jsx", ".ts"]`                                                   |
| fix                           | `false`        | `"fix": true`                                                                                 |
| fixDryRun                     | `false`        | `"fixDryRun": true`                                                                           |
| format                        | `null`         | `"format": "codeframe"`                                                                       |
| global                        | `[]`           | `"global": "it"` or `"global": ["it", "describe"]`                                            |
| ignorePath                    | `null`         | `"ignorePath": "/path/to/ignore"`                                                             |
| ignorePattern                 | `[]`           | `"ignorePattern": ["/path/to/ignore/*"]`                                                      |
| maxWarnings                   | `-1`           | `"maxWarnings": 0`                                                                            |
| noEslintrc                    | `false`        | `"noEslintrc": true`                                                                          |
| noIgnore                      | `false`        | `"noIgnore": true`                                                                            |
| noInlineConfig                | `false`        | `"noInlineConfig": true`                                                                      |
| parser                        | `espree`       | `"parser": "flow"`                                                                            |
| parserOptions                 | `{}`           | `"parserOptions": { "myOption": true }`                                                       |
| plugin                        | `[]`           | `"plugin": "prettier"` or `"plugin": ["pettier", "other"]`                                    |
| quiet                         | `false`        | `"quiet": true`                                                                              |
| reportUnusedDisableDirectives | `false`        | `"reportUnusedDisableDirectives": true`                                                       |
| rules                         | `{}`           | `"rules": {"quotes": [2, "double"]}` or `"rules": {"quotes": [2, "double"], "no-console": 2}` |
| rulesdir                      | `[]`           | `"rulesdir": "/path/to/rules/dir"` or `"env": ["/path/to/rules/dir", "/path/to/other"]`       |
