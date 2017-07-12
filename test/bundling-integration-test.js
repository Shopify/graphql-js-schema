import assert from 'assert';
import tmp from 'tmp';
import path from 'path';
import {transformFileSync} from 'babel-core';
import {writeFileSync} from 'fs';

import getFixture from './get-fixture';
import {rollupAndWriteBundle} from '../src/writers';
import generateSchemaModules from '../src/index';

function buildCompileAndImportModule(whitelistConfig = false) {
  tmp.setGracefulCleanup();

  const tmpDir = tmp.dirSync().name;

  const introspectionResponse = JSON.parse(getFixture('schema.json'));
  const modules = generateSchemaModules(introspectionResponse, 'Schema', whitelistConfig);

  return rollupAndWriteBundle('Schema', tmpDir, modules).then(() => {
    const bundleFileName = path.join(tmpDir, 'schema.js');
    const options = {
      presets: [
        path.join(process.cwd(), 'node_modules/babel-preset-shopify/node')
      ]
    };
    const body = transformFileSync(bundleFileName, options).code;

    const compiledFilePath = path.join(tmpDir, 'compiled.js');

    writeFileSync(compiledFilePath, body);

    try {
      const bundle = require(compiledFilePath).default;

      return Promise.resolve(bundle);
    } catch (error) {
      return Promise.reject(error);
    }
  });
}

suite('bundling-integration-test', () => {
  test('it creates an importable bundle', () => {
    // will reject on failure
    return buildCompileAndImportModule().then((bundle) => {
      assert.ok(bundle, 'program can be imported');
    }).catch((error) => {
      assert.ok(false, `the modules could not be imported:
        ${error.toString()}`);
    });
  });

  test('it deeply freezes the type bundle', () => {
    let leafCount = 0;

    function assertDeeplyFrozen(structure) {
      leafCount++;

      assert.ok(Object.isFrozen(structure), `structure not frozen at entry ${structure}`);

      Object.getOwnPropertyNames(structure).forEach((key) => {
        const value = structure[key];

        if (value && typeof value === 'object') {
          assertDeeplyFrozen(value);
        }
      });
    }

    return buildCompileAndImportModule().then((bundle) => {
      assertDeeplyFrozen(bundle);
      assert.equal(leafCount, 10, 'it traversed all objects in the tree');
    }, (error) => {
      assert.ok(false, `the modules could not be imported:
        ${error.toString()}`);
    });
  });

  test('it can bundle with a whitelist config', () => {
    return buildCompileAndImportModule({
      QueryRoot: [
        'node',
        'product'
      ],
      Node: [
        'id'
      ]
    }).then((bundle) => {
      assert.deepEqual(bundle, {
        mutationType: 'Mutation',
        queryType: 'QueryRoot',
        subscriptionType: null,
        types: {
          QueryRoot: {
            name: 'QueryRoot',
            kind: 'OBJECT',
            fieldBaseTypes: {
              node: 'Node',
              product: 'Product'
            },
            implementsNode: false
          },
          Node: {
            name: 'Node',
            kind: 'INTERFACE',
            fieldBaseTypes: {
              id: 'ID'
            },
            possibleTypes: [
              'Collection',
              'Product',
              'ProductOption',
              'ProductVariant'
            ]
          }
        }
      });
    }, (error) => {
      assert.ok(false, `the modules could not be imported:
        ${error.toString()}`);
    });
  });
});
