const Product = {
  "name": "Product",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "collections": "CollectionConnection",
    "createdAt": "DateTime",
    "handle": "String",
    "id": "ID",
    "images": "Image",
    "options": "ProductOption",
    "productType": "String",
    "publishedAt": "DateTime",
    "tags": "String",
    "title": "String",
    "updatedAt": "DateTime",
    "variants": "ProductVariantConnection",
    "vendor": "String"
  },
  "implementsNode": true
};
export default Product;
