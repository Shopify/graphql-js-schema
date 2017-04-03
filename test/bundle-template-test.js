import assert from 'assert';
import generate from 'babel-generator';
import getFixture from './get-fixture';

import bundleTemplate from '../src/bundle-template';

suite('bundle-template-test', () => {
  test('it can handle single types', () => {
    const types = [{name: 'SomeType', path: 'path/to/some/type.js'}];
    const rootTypeNames = {queryTypeName: 'SomeType', mutationTypeName: null, subscriptionTypeName: null};
    const expected = getFixture('single-resource-bundle.js');
    const output = bundleTemplate(rootTypeNames, types, 'Schema');

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
    const rootTypeNames = {queryTypeName: 'Shop', mutationTypeName: null, subscriptionTypeName: null};
    const expected = getFixture('multi-resource-bundle.js');
    const output = bundleTemplate(rootTypeNames, types, 'Types');

    assert.equal(generate(output).code.trim(), expected.trim());
  });

  test('it doesn\'t explode when passed no types', () => {
    const types = [];
    const rootTypeNames = {queryTypeName: null, mutationTypeName: null, subscriptionTypeName: null};
    const expected = getFixture('zero-resource-bundle.js');
    const output = bundleTemplate(rootTypeNames, types, 'Bundle');

    assert.equal(generate(output).code.trim(), expected.trim());
  });
});
