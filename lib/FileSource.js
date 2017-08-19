import fs from 'fs';

import Rx from 'rxjs/Rx';

import Builder from './Builder';
import { toList } from './util';

function getInputStream(path = '', encoding = 'utf8') {
  if (path) {
    return fs.createReadStream(path, encoding);
  }
  process.stdin.setEncoding(encoding);
  return process.stdin;
}

const FileSource = Builder.of('parser', ({ parser }) =>
  Builder.of('schema,path,linesep,encoding', ({ schema, path, linesep = '\n', encoding = 'utf8' }) => {
    let currentSchema = toList(schema);
    return {
      read: () => Rx.Observable.create((observer) => {
        const parse = (line) => {
          const parsed = parser({ schema: currentSchema, line });
          if (parsed.schema) {
            currentSchema = parsed.schema;
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
        inputStream.on('error', observer.onError);
      }),
    };
  }),
);
export default FileSource;
