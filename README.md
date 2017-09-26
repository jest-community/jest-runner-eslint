# jest-runner-eslint

[![Build Status](https://travis-ci.org/rogeliog/jest-runner-eslint.svg?branch=master)](https://travis-ci.org/rogeliog/jest-runner-eslint) [![npm version](https://badge.fury.io/js/jest-runner-eslint.svg)](https://badge.fury.io/js/jest-runner-eslint)

An experimental ESLint runner for Jest

![runner-eslint](https://user-images.githubusercontent.com/574806/30197438-9681385c-941c-11e7-80a8-2b11f15bd412.gif)


## Usage

### Install

Install `jest`_(it needs Jest 21+)_ and `jest-runner-eslint`

```bash
yarn add --dev jest jest-runner-eslint

# or with NPM

npm install --save-dev jest jest-runner-eslint

```

### Add it to your Jest config

In your `package.json`
```json
{
  "jest": {
    "runner": "jest-runner-eslint"
  }
}
```

Or in `jest.config.js`
```js
module.exports = {
  runner: 'jest-runner-eslint',
}
```

### Run Jest
```bash
yarn jest
```


## Options

This project uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig), so you can provide config via:
* a `jest-runner-eslint` property in your `package.json`
* a `jest-runner-eslint.config.js` JS file
* a `.jest-runner-eslintrc` JSON file


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
  }
}
```


### cliOptions

jest-runner-eslint maps a lot of ESLint CLI arguments to config options. For example `--fix` is `cliOptions.fix`

|option|default|example
|-----|-----|-----|
|cacheLocation|`.eslintcache`|`"cacheLocation": "/path/to/cache"`
|config|`null`|`"config": "/path/to/config"`
|env|`null`|`"env": "mocha"` or `"env": ["mocha", "other"]`
|ext|`[".js"]`|`"ext": ".jsx"` or `"ext": [".jsx", ".ts"]`
|fix|`false`|`"fix": true`
|global|`[]`|`"global": "it"` or `"global": ["it", "describe"]`
|ignorePath|`null`|`"ignorePath": "/path/to/ignore"`
|noEslintrc|`false`|`"noEslintrc": true`
|noIgnore|`false`|`"noIgnore": true`
|noInlineConfig|`false`|`"noInlineConfig": true`
|parser|`espree`|`"parser": "flow"`
|parserOptions|`{}`|`"parserOptions": { "myOption": true }`
|plugin|`[]`|`"plugin": "prettier"` or `"plugin": ["pettier", "other"]`
|rule|`null`|`"rule": "'quotes: [2, double]'"` or `"rule": ["quotes: [2, double]", "no-console: 2"]`
|rulesdir|`[]`|`"rulesdir": "/path/to/rules/dir"` or `"env": ["/path/to/rules/dir", "/path/to/other"]`
