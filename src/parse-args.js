import minimist from 'minimist';

export default function parseArgs(rawArgs) {
  const args = minimist(rawArgs, {
    boolean: 'bundle-only',
    string: [
      'schema-file',
      'outdir',
      'schema-bundle-name',
      'whitelist-type'
    ],
    default: {
      'schema-bundle-name': 'Schema',
      'bundle-only': false
    }
  });

  if (args.help || !(args['schema-file'] && args.outdir)) {
    return {showHelp: true};
  }

  return {
    schemaFile: args['schema-file'],
    outdir: args.outdir,
    schemaBundleName: args['schema-bundle-name'],
    bundleOnly: args['bundle-only'],
    whitelistTypes: args['whitelist-type'] || false
  };
}
