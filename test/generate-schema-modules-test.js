import assert from 'assert';
import getFixture from './get-fixture';

import generateSchemaModules from '../src/index';

suite('This will validate the output of the `generateSchemaModules` function', () => {
  test('it can convert a schema into a set of files and bundle object', () => {
    const inputSchema = JSON.parse(getFixture('schema.json'));
    const expected = JSON.parse(getFixture('simplified-schema-bundle.json'));
    const modules = generateSchemaModules(inputSchema, 'Schema');

    assert.deepEqual(modules, expected);
  });
});
