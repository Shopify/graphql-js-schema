import assert from 'assert';
import getFixture from './get-fixture';

import typeTemplate from '../src/type-template';

import generate from 'babel-generator';

suite('This will ensure that types can be generated and exported as standalone modules', () => {
  test('it exports types', () => {
    const type = {
      name: 'Product',
      kind: 'OBJECT',
      scalars: {
        title: {
          type: 'String',
          kind: 'SCALAR',
          isList: true,
          args: []
        }
      },
      objects: {},
      connections: {},
      fieldOf: []
    };

    const expected = getFixture('type-template-output.js');

    const output = typeTemplate(type);

    assert.equal(generate(output).code.trim(), expected.trim());
  });
});
