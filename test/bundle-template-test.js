import assert from 'assert';
import getFixture from './get-fixture';

import bundleTemplate from '../src/bundle-template';

import generate from 'babel-generator';

suite('This will ensure that bundles can be generated', () => {
  test('it can handle single types', () => {
    const types = [{name: 'SomeType', path: 'path/to/some/type.js'}];

    const expected = getFixture('single-resource-bundle.js');

    const output = bundleTemplate(types, 'Schema');

    assert.equal(generate(output).code.trim(), expected.trim());
  });

  test('it can handle many types', () => {
    const types = [{
      name: 'Product', path: 'types/product.js'
    }, {
      name: 'Shop', path: 'types/shop.js'
    }, {
      name: 'Collection', path: 'types/collection.js'
    }];

    const expected = getFixture('multi-resource-bundle.js');

    const output = bundleTemplate(types, 'Types');

    assert.equal(generate(output).code.trim(), expected.trim());
  });

  test('it doesn\'t explode when passed no types', () => {
    const types = [];

    const expected = getFixture('zero-resource-bundle.js');

    const output = bundleTemplate(types, 'Bundle');

    assert.equal(generate(output).code.trim(), expected.trim());
  });
});
