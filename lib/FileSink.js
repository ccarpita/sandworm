import fs from 'fs';

import Builder from './Builder';
import { toList } from './util';

/**
 * FileSink is a Builder which will generate a format-specific Builder from a serialization
 * function.  This Builder will in turn build an Observer that can be used to write a stream
 * of records to an output file or process.stdout.
 */
const FileSink = Builder.of('serialize, linesep', ({ serialize, linesep = '\n' }) => Builder.of('schema, path', (opt) => {
  let schema = toList(opt.schema);
  const path = opt.path;
  let writeHandle;
  let onComplete = () => {};
  return {
    complete: onComplete,
    error: onComplete,
    next: (record) => {
      if (!writeHandle) {
        writeHandle = new Promise((resolve) => {
          if (!path) {
            resolve((...args) => process.stdout.write(...args));
          } else {
            const stream = fs.createWriteStream(path);
            stream.once('open', () => {
              resolve((...args) => stream.write(...args));
            });
            onComplete = () => stream.end();
          }
        });
      }
      writeHandle.then((write) => {
        const result = serialize({ record, schema, linesep });
        if (result.schema) {
          schema = result.schema;
        }
        if (result.buffer) {
          write(result.buffer);
        }
      });
    },
  };
}));
export default FileSink;
