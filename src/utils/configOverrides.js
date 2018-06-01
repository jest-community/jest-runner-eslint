let overrides = {};

const setConfigOverrides = newOverrides => {
  overrides = Object.assign({}, overrides, newOverrides);
};

const getConfigOverrides = () => overrides;

exports.setConfigOverrides = setConfigOverrides;
exports.getConfigOverrides = getConfigOverrides;
