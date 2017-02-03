import assert from 'assert';
import getFixture from './get-fixture';

import simplifyType from '../src/simplify-type';

suite('This will ensure that we\'re destructuring types from the schema into types we export as modules', () => {
  test('it simplifies types of kind OBJECT', () => {
    const schemaObjectType = JSON.parse(getFixture('schema-object-type.json'));
    const simplifiedObject = JSON.parse(getFixture('simplified-object-type.json'));

    assert.deepEqual(simplifyType(schemaObjectType), simplifiedObject);
  });

  test('it generates inputFieldBaseTypes for kind OBJECT with name Mutation', () => {
    const schemaObjectType = JSON.parse(getFixture('schema-mutation-object-type.json'));
    const simplifiedObject = JSON.parse(getFixture('simplified-mutation-object-type.json'));

    assert.deepEqual(simplifyType(schemaObjectType), simplifiedObject);
  });

  test('it simplifies types of kind INPUT_OBJECT', () => {
    const schemaObjectType = JSON.parse(getFixture('schema-input-object-type.json'));
    const simplifiedObject = JSON.parse(getFixture('simplified-input-object-type.json'));

    assert.deepEqual(simplifyType(schemaObjectType), simplifiedObject);
  });

  test('it doesn\'t explode when passed a SCALAR type', () => {
    const schemaScalarType = JSON.parse(getFixture('schema-scalar-type.json'));
    const simplifiedScalar = JSON.parse(getFixture('simplified-scalar-type.json'));

    assert.deepEqual(simplifyType(schemaScalarType), simplifiedScalar);
  });

  test('it simplifies types of kind INTERFACE', () => {
    const schemaInterfaceType = JSON.parse(getFixture('schema-interface-type.json'));
    const simplifiedInterface = JSON.parse(getFixture('simplified-interface-type.json'));

    assert.deepEqual(simplifyType(schemaInterfaceType), simplifiedInterface);
  });
});
