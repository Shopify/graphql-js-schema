import minimist from 'minimist';

export default function parseArgs(rawArgs) {
  const args = minimist(rawArgs, {default: {'schema-bundle-name': 'Schema'}});

  if (args.help || !(args['schema-file'] || args.outdir)) {
    return {showHelp: true};
  }

  return {
    schemaFile: args['schema-file'],
    outdir: args.outdir,
    schemaBundleName: args['schema-bundle-name'],
    bundleOnly: args['bundle-only']
  };
}
