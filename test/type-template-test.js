import assert from 'assert';
import generate from 'babel-generator';
import getFixture from './get-fixture';

import typeTemplate from '../src/type-template';

suite('type-template-test', () => {
  test('it exports OBJECT types', () => {
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

    const expected = getFixture('object-type-template-output.js');

    const output = typeTemplate(type);

    assert.equal(generate(output).code.trim(), expected.trim());
  });

  test('it exports OBJECT types of name Mutation', () => {
    const type = {
      name: 'Mutation',
      kind: 'OBJECT',
      fieldBaseTypes: {
        apiCustomerAccessTokenCreate: 'ApiCustomerAccessTokenCreatePayload',
        apiCustomerAccessTokenDelete: 'ApiCustomerAccessTokenDeletePayload',
        apiCustomerAccessTokenRenew: 'ApiCustomerAccessTokenRenewPayload'
      },
      implementsNode: false,
      relayInputObjectBaseTypes: {
        apiCustomerAccessTokenCreate: 'ApiCustomerAccessTokenCreateInput',
        apiCustomerAccessTokenDelete: 'ApiCustomerAccessTokenDeleteInput',
        apiCustomerAccessTokenRenew: 'ApiCustomerAccessTokenRenewInput'
      }
    };

    const expected = getFixture('mutation-object-type-template-output.js');

    const output = typeTemplate(type);

    assert.equal(generate(output).code.trim(), expected.trim());
  });

  test('it exports INPUT_OBJECT types', () => {
    const type = {
      name: 'ApiCustomerAccessTokenCreateInput',
      kind: 'INPUT_OBJECT',
      inputFieldBaseTypes: {
        clientMutationId: 'String',
        email: 'String',
        password: 'String'
      }
    };

    const expected = getFixture('input-object-type-template-output.js');

    const output = typeTemplate(type);

    assert.equal(generate(output).code.trim(), expected.trim());
  });

  test('it exports INTERFACE types', () => {
    const type = {
      name: 'Node',
      kind: 'INTERFACE',
      fieldBaseTypes: {
        id: 'ID'
      },
      possibleTypes: ['ApiCustomerAccessToken', 'Collection', 'CreditCardPaymentRequest', 'Order', 'Product', 'ProductOption', 'ProductVariant', 'PurchaseSession', 'ShippingRatesRequest', 'ShopPolicy']
    };

    const expected = getFixture('interface-type-template-output.js');

    const output = typeTemplate(type);

    assert.equal(generate(output).code.trim(), expected.trim());
  });
});
