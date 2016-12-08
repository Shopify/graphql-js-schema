import Product from "./types/product";
import Shop from "./types/shop";
import Collection from "./types/collection";
const Types = {
  types: {}
};
Types.types["Product"] = Product;
Types.types["Shop"] = Shop;
Types.types["Collection"] = Collection;
Object.freeze(Types.types);
export default Object.freeze(Types);
