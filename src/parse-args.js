import minimist from 'minimist';

function shouldShowHelp(args) {
  return (args.help || !(args['schema-file'] && args.outdir));
}

export default function parseArgs(rawArgs) {
  const args = minimist(rawArgs, {
    boolean: [
      'bundle-only',
      'commonjs'
    ],
    string: [
      'schema-file',
      'outdir',
      'schema-bundle-name',
      'whitelist-config'
    ],
    default: {
      'schema-bundle-name': 'Schema',
      'bundle-only': false,
      commonjs: false
    }
  });

  if (shouldShowHelp(args)) {
    return {showHelp: true};
  }

  return {
    schemaFile: args['schema-file'],
    outdir: args.outdir,
    schemaBundleName: args['schema-bundle-name'],
    bundleOnly: args['bundle-only'],
    whitelistConfig: args['whitelist-config'],
    commonjs: args.commonjs
  };
}
