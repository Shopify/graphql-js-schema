#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import tmp from 'tmp';
import {rollup} from 'rollup';
import dasherize from 'lodash.kebabcase';

import parseArgs from './parse-args';
import help from './help';
import graphqlJsSchema from './index';

const args = parseArgs(process.argv.slice(2));

if (args.showHelp) {
  console.log(help);
  process.exit(0);
}

const schema = JSON.parse(fs.readFileSync(args.schemaFile));

function writeFiles(outdir, files) {
  return Promise.all(files.map((file) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(outdir, file.path), file.body, (err) => {
        if (err) {
          console.log('bork');
          console.log(err);
          console.log('bork');
          reject(err);

          return;
        }

        console.log(`wroteFile: ${path.join(outdir, file.path)}`);
        resolve();
      });
    });
  }));
}

graphqlJsSchema(schema, args.schemaBundleName).then((files) => {

  if (args.bundleOnly) {
    const tmpDir = tmp.dirSync();

    mkdirp.sync(path.join(tmpDir.name, 'types'));

    const entryFilename = `${dasherize(args.schemaBundleName)}.js`
    const entryFilePath = path.join(tmpDir.name, entryFilename);

    return writeFiles(tmpDir.name, files).then(() => {
      return rollup({
        entry: entryFilePath
      });
    }).then((bundle) => {
      return bundle.write({
        format: 'es',
        dest: path.join(args.outdir, entryFilename)
      });
    });
  } else {
    mkdirp.sync(path.join(args.outdir, 'types'));

    return writeFiles(args.outdir, files);
  }
}).catch((error) => {
  console.trace(error);
  process.exit(1);
});
