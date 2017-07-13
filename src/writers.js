import fs from 'fs';
import path from 'path';

function logFileWrite(filePath) {
  console.log(`wroteFile: ${filePath}`);
}

export function writeFiles(outdir, files, quiet = false) {
  return Promise.all(files.map((file) => {
    return writeFile(outdir, file.path, file.body, quiet);
  }));
}

export function writeFile(outdir, filename, body, quiet = false) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(outdir, filename), body, (err) => {
      if (err) {
        reject(err);

        return;
      }

      if (!quiet) {
        logFileWrite(path.join(outdir, filename));
      }
      resolve();
    });
  });
}
