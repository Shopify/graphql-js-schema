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

function logFileWrite(filePath) {
  console.log(`wroteFile: ${filePath}`);
}

function writeFiles(outdir, files, quiet = false) {
  return Promise.all(files.map((file) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(outdir, file.path), file.body, (err) => {
        if (err) {
          reject(err);

          return;
        }

        if (!quiet) {
          logFileWrite(path.join(outdir, file.path));
        }
        resolve();
      });
    });
  }));
}

function rollupAndWriteBundle(schemaBundleName, outdir, files) {
  const tmpDir = tmp.dirSync();

  mkdirp.sync(path.join(tmpDir.name, 'types'));

  const entryFilename = `${dasherize(schemaBundleName)}.js`;
  const entryFilePath = path.join(tmpDir.name, entryFilename);
  const bundleFilePath = path.join(outdir, entryFilename);

  return writeFiles(tmpDir.name, files, true).then(() => {
    return rollup({
      entry: entryFilePath
    });
  }).then((bundle) => {
    return bundle.write({
      format: 'es',
      dest: bundleFilePath
    });
  }).then(() => {
    logFileWrite(bundleFilePath);
  });
}

graphqlJsSchema(schema, args.schemaBundleName).then((files) => {
  if (args.bundleOnly) {
    return rollupAndWriteBundle(args.schemaBundleName, args.outdir, files);
  } else {
    mkdirp.sync(path.join(args.outdir, 'types'));

    return writeFiles(args.outdir, files);
  }
}).catch((error) => {
  console.trace(error);
  process.exit(1);
});
