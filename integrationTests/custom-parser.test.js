const runJest = require('./runJest');

it("Doesn't overwrite parser when not set", () => {
  return expect(runJest('custom-parser')).resolves.toMatchSnapshot();
});
