[![Circle CI](https://circleci.com/gh/Shopify/graphql-js-schema.png?circle-token=93549bd063e7d394b231f147e68f2311dc871e8d)](https://circleci.com/gh/Shopify/graphql-js-schema)

# graphql-js-schema

Transforms the JSON representation of a GraphQL schema into a set of ES6 type modules.

## Table Of Contents

- [Installation](#installation)
- [Examples](#examples)
- [API](#api)
- [Schema Modules](#schema-modules)
- [License](http://github.com/Shopify/graphql-js-schema/blob/master/LICENSE.md)

## Installation

#### With Yarn:

```bash
$ yarn global add graphql-js-schema
```

#### With NPM:

```bash
$ npm install -g graphql-js-schema
```

## Examples

To transform a GraphQL schema file (as json) into a set of ES6 consumable
modules, run the following command.

```bash
graphql-js-schema --schema-file ./schema.json --outdir schema --schema-bundle-name="Types"
```

This will create a directory called schema, and a root module called `Schema` in
the file `schema/types.js`. It will also collect all the non-scalar types in
`schema/types/`, and export them. The top level bundle exists for convenience,
but you can consume these modules however you like.

## API

Exports one function that transforms a schema object into a list of files and
their associated bodies.

```javascript
import graphqlJsSchema from 'graphql-js-schema';

graphqlJsSchema(schemaHash, "BundleName").then((files) => {
  // Do stuff with hashes in the format:
  // {
  //   path: 'types/product.js',
  //   body: '...'
  // }
});
```

## Schema Modules

```javascript

import Schema from 'schema/schema';

Schema.Product.name // => Product
Schema.Product.implementsNode // => true
Schema.Product.kind // => OBJECT

// All type strings returned through `fieldBaseTypes` are available in the
// schema for further exploration.

Schema.Product.fieldBaseTypes.id // => ID
Schema.Product.fieldBaseTypes.handle // => String
Schema.Product.fieldBaseTypes.images // => Image
Schema.Product.fieldBaseTypes.options // => ProductOption
Schema.Product.fieldBaseTypes.productType // => String
Schema.Product.fieldBaseTypes.publishedAt // => DateTime
Schema.Product.fieldBaseTypes.tags // => String
Schema.Product.fieldBaseTypes.vendor // => String
Schema.Product.fieldBaseTypes.collections // => CollectionConnection
Schema.Product.fieldBaseTypes.variants // => ProductVariantConnection
Schema.Product.fieldBaseTypes.createdAt // => DateTime
Schema.Product.fieldBaseTypes.updatedAt // => DateTime

```

## License

MIT, see [LICENSE.md](http://github.com/Shopify/graphql-js-schema/blob/master/LICENSE.md) for details.

<img src="https://cdn.shopify.com/shopify-marketing_assets/builds/19.0.0/shopify-full-color-black.svg" width="200" />
