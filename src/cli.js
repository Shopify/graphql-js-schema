#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

import parseArgs from './parse-args';
import help from './help';
import {writeFiles, writeFile} from './writers';
import generateSchemaModules, {generateSchemaBundle} from './index';

function runCli() {
  const args = parseArgs(process.argv.slice(2));

  if (args.showHelp) {
    console.log(help);
    process.exit(0);
  }

  let whitelistConfig;

  if (args.whitelistConfig) {
    whitelistConfig = JSON.parse(fs.readFileSync(args.whitelistConfig));
  }

  const introspectionResponse = JSON.parse(fs.readFileSync(args.schemaFile));

  if (args.bundleOnly) {
    mkdirp.sync(args.outdir);

    return generateSchemaBundle(introspectionResponse, args.schemaBundleName, whitelistConfig).then((bundle) => {
      return writeFile(args.outdir, bundle.path, bundle.body);
    });

  } else {
    const files = generateSchemaModules(introspectionResponse, args.schemaBundleName, whitelistConfig);

    mkdirp.sync(path.join(args.outdir, 'types'));

    return writeFiles(args.outdir, files);
  }
}

runCli().catch((error) => {
  console.trace(error);
  process.exit(1);
});
