/* eslint-disable no-unreachable */
const assert = require('assert');

throw new Error('Some error message');

describe('My tests', () => {
  it('This is a test', () => {
    assert.equal(1, 1);
  });
});
