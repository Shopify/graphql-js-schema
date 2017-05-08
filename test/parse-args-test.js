import assert from 'assert';
import parseArgs from '../src/parse-args';

suite('parse-args-test', () => {
  const requiredArgs = ['--schema-file', 'schema.json', '--outdir', 'whatever'];

  test('it defaults to Schema and not a bundle', () => {
    const opts = parseArgs(requiredArgs);

    assert.equal(opts.schemaBundleName, 'Schema');
    assert.equal(opts.bundleOnly, false);
  });

  test('it can parse passed args', () => {
    const opts = parseArgs([
      '--bundle-only',
      '--schema-bundle-name',
      'Types'
    ].concat(...requiredArgs));

    assert.equal(opts.schemaFile, 'schema.json');
    assert.equal(opts.outdir, 'whatever');
    assert.equal(opts.schemaBundleName, 'Types');
    assert.equal(opts.bundleOnly, true);
  });

  test('it shows help when required args are missing', () => {
    assert.equal(parseArgs([]).showHelp, true, 'no args');
    assert.equal(parseArgs(['--schema-file', 'whatever']).showHelp, true, 'missing --outdir');
    assert.equal(parseArgs(['--outdir', 'whatever']).showHelp, true, 'missing --schema-file');
  });

  test('it shows help when the help arg is passed', () => {
    assert.equal(parseArgs(['--help']).showHelp, true);
  });

  test('it parses type white lists', () => {
    const opts = parseArgs([
      '--whitelist-type', 'Product',
      '--whitelist-type', 'Collection',
      '--whitelist-type', 'String',
      '--whitelist-type', 'Money'
    ].concat(requiredArgs));

    assert.deepEqual(opts.whitelistTypes, ['Product', 'Collection', 'String', 'Money']);
  });

  test('it parses a whitelist config json file', () => {
    const opts = parseArgs([
      '--whitelist-config', 'profile.json'
    ].concat(requiredArgs));

    assert.equal(opts.whitelistConfig, 'profile.json');
  });

  test('it shows help if you try to supply a whitelist type and a whitelist config', () => {
    const opts = parseArgs([
      '--whitelist-type', 'Product',
      '--whitelist-config', 'profile.json'
    ].concat(requiredArgs));

    assert.equal(opts.showHelp, true);
  });
});
