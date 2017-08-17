import fs from 'fs'

import Rx from 'rxjs/Rx';

import Builder from './Builder';

function getInputStream(path = '', encoding = 'utf8') {
  if (path) {
    return fs.createReadStream(path, encoding);
  }
  process.stdin.setEncoding(encoding);
  return process.stdin;
}

export default FileSource = Builder.of('parser', ({parser}) =>
  Builder.of('schema,path,linesep,encoding', ({schema, path, linesep = '\n', encoding = 'utf8'}) => {
    return {
      read: () => {
        return Rx.Observable.create((observer) => {
          let parsed = false;
          const parse = (line) => {
            const parsed = parser({schema, line});
            if (parsed.schema) {
              schema = parsed.schema;
            }
            if (parsed.record) {
              observer.onNext(parsed.record);
            }
          };
          const inputStream = getInputStream(path, encoding);
          let buffer = '';
          inputStream.on('data', (chunk) => {
            buffer += chunk;
            const lines = buffer.split(linesep);
            buffer = lines.pop();
            lines.forEach(parse);
          });
          inputStream.on('end', () => {
            if (buffer) {
              parse(buffer);
              buffer = '';
            }
            observer.onComplete();
          });
          inputStream.on('error',  observer.onError);
        });
      },
    };
  })
);
