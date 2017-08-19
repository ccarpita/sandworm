import {
  toList,
} from './util';

const Builder = {
  of: (propslist, builderFn, builderExtFn) => {
    const props = toList(propslist);
    const decorate = (builder = {}) => {
      const decorated = Object.assign({}, builder);
      const properties = {};
      props.forEach((prop) => {
        properties[prop] = builder[prop];
        decorated[prop] = (val) => {
          if (typeof val !== 'undefined') {
            return decorate(Object.assign(
              {},
              properties,
              { [prop]: val }));
          }
          return properties[prop];
        };
      });
      decorated.build = () => builderFn(properties);
      if (builderExtFn) {
        return builderExtFn(decorated);
      }
      return decorated;
    };
    return decorate(builderFn);
  },
};

export default Builder;
