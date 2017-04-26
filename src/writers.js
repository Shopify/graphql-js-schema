import {rollup} from 'rollup';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import tmp from 'tmp';
import dasherize from 'lodash.kebabcase';

function logFileWrite(filePath) {
  console.log(`wroteFile: ${filePath}`);
}

export function writeFiles(outdir, files, quiet = false) {
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

export function rollupAndWriteBundle(schemaBundleName, outdir, files) {
  tmp.setGracefulCleanup();
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
