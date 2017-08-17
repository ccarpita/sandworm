import FileSink from './FileSink';

export default TsvSink = FileSink.serialize(({schema, record, linesep = '\n'}) => {
  if (!schema) {
    schema = Object.keys(record).sort();
  }
  const buffer = schema.map(prop => record[prop]).join('\t') + linesep;
  return {buffer, schema};
}).build();
