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
