import fs from 'fs';

/**
 * FileSink is a Builder which will generate a format-specific Builder from a serialization
 * function.  This Builder will in turn build an Observer that can be used to write a stream
 * of records to an output file or process.stdout.
 */
export default FileSink = Builder.of('serialize, linesep', ({serialize, linesep = '\n'}) => Builder.of('schema, path', ({schema, path}) => {
  let fh;
  let writeHandle;
  let onComplete = () => {};
  return {
    complete: onComplete,
    error: onComplete,
    next: (record) => {
      if (!writeHandle) {
        writeHandle = new Promise((resolve, reject) => {
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
        const result = serialize({record, schema, linesep});
        if (result.schema) {
          schema = result.schema;
        }
        if (result.buffer) {
          write(result.buffer);
        }
      });
    }
  }
}));
