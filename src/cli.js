#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

import parseArgs from './parse-args';
import help from './help';
import graphqlJsSchema from './index';

const args = parseArgs(process.argv.slice(2));

if (args.showHelp) {
  console.log(help);
  process.exit(0);
}

const schema = JSON.parse(fs.readFileSync(args.schemaFile));

graphqlJsSchema(schema, args.schemaBundleName).then((files) => {
  mkdirp.sync(path.join(args.outdir, 'types'));

  return new Promise((resolve) => {
    const expectedWriteCount = files.length;
    let writeCount = 0;

    files.forEach((file) => {
      fs.writeFile(path.join(args.outdir, file.path), file.body, () => {
        console.log(`wroteFile: ${path.join(args.outdir, file.path)}`);
        writeCount++;
        if (writeCount === expectedWriteCount) {
          resolve();
        }
      });
    });
  });

}).catch((error) => {
  console.trace(error);
  process.exit(1);
});
