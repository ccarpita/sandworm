import FileSource from './FileSource';

export default TsvSource = FileSource.parser(({schema, line}) => {
  const vals = line.split(/\t/);
  if (!schema) {
    return {schema: vals};
  }
  const record = {};
  schema.forEach((field, i) => {
    record[field] = vals[i];
  });
  return {record: record};
}).build();

