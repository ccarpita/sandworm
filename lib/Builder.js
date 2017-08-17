import {
  toList,
} from './util';

export default Builder = {
  of: (propslist, builderFn) => {
    const props = toList(propslist);
    const decorate = (builder = {}) => {
      const properties = {};
      props.forEach((prop) => {
        properties[prop] = builder[prop];
        builder[prop] = (val) => {
          if (typeof val !== 'undefined') {
            return decorate(Object.assign(
                {},
                properties,
                {[prop]: val}));
          }
          return properties[prop];
        }
      });
      builder.build = () => builderFn(properties);
      return obj;
    };
    return decorate(builderFn);
  }
}
