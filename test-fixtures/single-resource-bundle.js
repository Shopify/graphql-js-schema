import SomeType from "./path/to/some/type";
const Schema = {
  types: {}
};
Schema.types["SomeType"] = SomeType;
Schema.queryType = "SomeType";
Schema.mutationType = null;
Schema.subscriptionType = null;
Object.freeze(Schema.types);
export default Object.freeze(Schema);
