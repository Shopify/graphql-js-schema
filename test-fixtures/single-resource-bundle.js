import SomeType from "./path/to/some/type";
const Schema = {
  types: {}
};
Schema.types["SomeType"] = SomeType;
Schema.queryType = "SomeType";
Schema.mutationType = null;
Schema.subscriptionType = null;

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

export default recursivelyFreezeObject(Schema);
