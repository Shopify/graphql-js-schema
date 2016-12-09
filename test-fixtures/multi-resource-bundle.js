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
Object.freeze(Types.types);
export default Object.freeze(Types);
