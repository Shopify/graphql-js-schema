import assert from 'assert';
import getFixture from './get-fixture';

import generateSchemaModules from '../src/index';

suite('generate-schema-modules-test', () => {
  test('it can convert a schema into a set of files and bundle object', () => {
    const introspectionResponse = JSON.parse(getFixture('schema.json'));
    const expected = JSON.parse(getFixture('simplified-schema-bundle.json'));
    const modules = generateSchemaModules(introspectionResponse, 'Schema');

    assert.deepEqual(modules, expected);
  });
});
