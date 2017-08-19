import FileSink from './FileSink';

const TsvSink = FileSink.serialize(({ schema, record, linesep = '\n' }) => {
  const currentSchema = schema || Object.keys(record).sort();
  const buffer = schema.map(prop => record[prop]).join('\t') + linesep;
  return { buffer, schema: currentSchema };
}).build();
export default TsvSink;
