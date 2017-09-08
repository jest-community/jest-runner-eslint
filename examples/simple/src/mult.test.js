const assert = require('assert');
const mult = require('./mult');

it('Multiplies two numbers', () => {
  assert.equal(mult(3, 2), 6);
});
