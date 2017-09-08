require('should');
const sum = require('./sum');

it('Sums two numbers', () => {
  sum(1, 2).should.equal(3);
});
