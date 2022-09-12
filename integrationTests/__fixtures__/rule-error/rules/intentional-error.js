// Intentional create an error from eslint
module.exports = {
  meta: {
    docs: {
      description: 'Cause an intentional error at rule evalutation time',
    },
    schema: [],
  },
  create(context) {
    return {
      Identifier(node) {
        const obj = {};
        obj.will.cause.an.error.here;
      },
    };
  },
};
