import assert from 'assert';
import generate from 'babel-generator';
import getFixture from './get-fixture';

import typeTemplate from '../src/type-template';

suite('This will ensure that types can be generated and exported as standalone modules', () => {
  test('it exports types', () => {
    const type = {
      name: 'Product',
      kind: 'OBJECT',
      fieldBaseTypes: {
        collections: 'CollectionConnection',
        createdAt: 'DateTime',
        handle: 'String',
        id: 'ID',
        images: 'Image',
        options: 'ProductOption',
        productType: 'String',
        publishedAt: 'DateTime',
        tags: 'String',
        title: 'String',
        updatedAt: 'DateTime',
        variants: 'ProductVariantConnection',
        vendor: 'String'
      },
      implementsNode: true
    };

    const expected = getFixture('type-template-output.js');

    const output = typeTemplate(type);

    assert.equal(generate(output).code.trim(), expected.trim());
  });
});
