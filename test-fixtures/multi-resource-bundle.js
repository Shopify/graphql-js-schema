import Product from "./types/product";
import Shop from "./types/shop";
import Collection from "./types/collection";
const Types = {
  types: {}
};
Types.types["Product"] = Product;
Types.types["Shop"] = Shop;
Types.types["Collection"] = Collection;
Types.queryType = "Shop";
Types.mutationType = null;
Types.subscriptionType = null;

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

export default recursivelyFreezeObject(Types);
