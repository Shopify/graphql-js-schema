import Product from "./types/product";
import Shop from "./types/shop";
import Collection from "./types/collection";
const Types = {};
Types["Product"] = Product;
Types["Shop"] = Shop;
Types["Collection"] = Collection;
export default Object.freeze(Types);
