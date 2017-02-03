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
Object.freeze(Mutation.fieldBaseTypes);
Object.freeze(Mutation.relayInputObjectBaseTypes);
export default Object.freeze(Mutation);
