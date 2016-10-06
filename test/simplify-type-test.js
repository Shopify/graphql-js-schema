import assert from 'assert';
import getFixture from './get-fixture';

import simplifyType from '../src/simplify-type';

suite('This will ensure that we\'re destructuring types from the schema into types we export as modules', () => {
  test('it simplifies types of kind OBJECT', () => {
    const schemaObjectType = JSON.parse(getFixture('schema-object-type.json'));
    const simplifiedObject = JSON.parse(getFixture('simplified-object-type.json'));

    assert.deepEqual(simplifyType(schemaObjectType), simplifiedObject);
  });

  test('it doesn\'t explode when passed a SCALAR type', () => {
    const schemaScalarType = JSON.parse(getFixture('schema-scalar-type.json'));
    const simplifiedScalar = JSON.parse(getFixture('simplified-scalar-type.json'));

    assert.deepEqual(simplifyType(schemaScalarType), simplifiedScalar);
  });
});
