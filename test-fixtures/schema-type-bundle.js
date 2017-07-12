const QueryRoot = {
  "name": "QueryRoot",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "collection": "Collection",
    "node": "Node",
    "product": "Product",
    "shop": "Shop"
  },
  "implementsNode": false
};

const Node = {
  "name": "Node",
  "kind": "INTERFACE",
  "fieldBaseTypes": {
    "id": "ID"
  },
  "possibleTypes": ["Collection", "Product", "ProductOption", "ProductVariant"]
};

const Mutation = {
  "name": "Mutation",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "apiCustomerAccessTokenCreate": "ApiCustomerAccessTokenCreatePayload",
    "apiCustomerAccessTokenDelete": "ApiCustomerAccessTokenDeletePayload",
    "apiCustomerAccessTokenRenew": "ApiCustomerAccessTokenRenewPayload"
  },
  "implementsNode": false,
  "relayInputObjectBaseTypes": {
    "apiCustomerAccessTokenCreate": "ApiCustomerAccessTokenCreateInput",
    "apiCustomerAccessTokenDelete": "ApiCustomerAccessTokenDeleteInput",
    "apiCustomerAccessTokenRenew": "ApiCustomerAccessTokenRenewInput"
  }
};

const Types = {
  types: {}
};
Types.types["QueryRoot"] = QueryRoot;
Types.types["Node"] = Node;
Types.types["Mutation"] = Mutation;
Types.queryType = "QueryRoot";
Types.mutationType = "Mutation";
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

var types = recursivelyFreezeObject(Types);

export default types;
