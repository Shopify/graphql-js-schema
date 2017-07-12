#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

import parseArgs from './parse-args';
import help from './help';
import {writeFiles, rollupAndWriteBundle} from './writers';
import generateSchemaModules from './index';

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
  const files = generateSchemaModules(introspectionResponse, args.schemaBundleName, whitelistConfig);

  if (args.bundleOnly) {
    return rollupAndWriteBundle(args.schemaBundleName, args.outdir, files);
  } else {
    mkdirp.sync(path.join(args.outdir, 'types'));

    return writeFiles(args.outdir, files);
  }
}

runCli().catch((error) => {
  console.trace(error);
  process.exit(1);
});
