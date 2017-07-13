import assert from 'assert';
import getFixture from './get-fixture';

import {generateSchemaBundle} from '../src/index';

suite('api-generate-bundle-test', () => {
  test('it can return code for a bundle', () => {
    const introspectionResponse = JSON.parse(getFixture('schema.json'));
    const expected = getFixture('schema-type-bundle.js');

    return generateSchemaBundle(introspectionResponse, 'Types').then(({path, body}) => {
      assert.equal(path, 'types.js');
      assert.equal(body, expected);
    });
  });
});
