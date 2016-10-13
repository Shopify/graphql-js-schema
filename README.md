[![Circle CI](https://circleci.com/gh/Shopify/graphql-js-schema-fetch.png?circle-token=93549bd063e7d394b231f147e68f2311dc871e8d)](https://circleci.com/gh/Shopify/graphql-js-schema)

# graphql-js-schema

Transforms the JSON representation of a GraphQL schema into a set of ES6 type modules.

## Table Of Contents

- [Installation](#installation)
- [Examples](#examples)
- [API](#api)
- [Schema Modules](#schema-modules)
- [License](http://github.com/Shopify/graphql-js-schema/blob/master/LICENSE.md)

## Installation

```bash
$ npm install @shopify/graphql-js-schema
```

## Examples

To transform a GraphQL schema file (as json) into a set of ES6 consumable
modules, run the following command.

```bash
graphql-js-schema --schema-file ./schema.json --outdir schema --schema-bundle-name="Schema"
```

This will create a directory called schema, and a root module called `Schema` in
the file `schema/schema.js`. It wall also collect all the non-scalar types in
`schema/types`, and export them. The top level bundle exists for convenience,
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

// Types are separated into scalars, objects and connections.

// Scalars:
Schema.Product.scalars
Schema.Product.scalars.handle
Schema.Product.scalars.handle.type // => String
Schema.Product.scalars.handle.kind // => SCALAR
Schema.Product.scalars.handle.isList // => false
Schema.Product.scalars.handle.args // => []

// Objects
Schema.Product.objects.images
Schema.Product.objects.images.type // => Image
Schema.Product.objects.images.kind // => OBJECT
Schema.Product.objects.images.isList // => true
Schema.Product.objects.images.args // => ["first", "maxWidth", "maxHeight", "crop", "scale"]

// Connections
Schema.Product.connections.collections
Schema.Product.connections.collections.type // => CollectionConnection
Schema.Product.connections.collections.kind // => OBJECT
Schema.Product.connections.collections.isList // => false
Schema.Product.connections.collections.args // => ["first", "after", "reverse"]

```

## License

MIT, see [LICENSE.md](http://github.com/Shopify/graphql-js-schema/blob/master/LICENSE.md) for details.

<img src="https://cdn.shopify.com/shopify-marketing_assets/builds/19.0.0/shopify-full-color-black.svg" width="200" />
