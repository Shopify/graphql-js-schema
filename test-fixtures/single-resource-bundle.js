import SomeType from "./path/to/some/type";
const Schema = {
  types: {}
};
Schema.types["SomeType"] = SomeType;
Object.freeze(Schema.types);
export default Object.freeze(Schema);
