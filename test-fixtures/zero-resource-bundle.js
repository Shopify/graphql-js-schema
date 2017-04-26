const Bundle = {
  types: {}
};

Bundle.queryType = null;
Bundle.mutationType = null;
Bundle.subscriptionType = null;

function recursivelyFreezeObject(structure) {
  Object.getOwnPropertyNames(structure).forEach(key => {
    const value = structure[key];
    if (value && typeof value === 'object') {
      recursivelyFreezeObject(value);
    }
  });
  Object.freeze(structure);
  return structure;
}

export default recursivelyFreezeObject(Bundle);
