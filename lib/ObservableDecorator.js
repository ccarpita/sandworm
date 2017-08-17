import Observable from 'rsjx/Observable'

export default const ObservableDecorator = {
  decorate: (observable, methods) => {
    Object.keys(observable)
      .filter(key => typeof observable[key] === 'function')
      .forEach(methodName => {
        const method = observable[methodName];
        observable[methodName] = (...args) => {
          const result = method.apply(observable, args);
          if (result instanceof Observable) {
            ObservableDecorator.decorate(result, methods);
          }
          return result;
        };
      });
    Object.keys(methods).forEach(methodName => {
      observable[methodName] = methods[methodName];
    });
  }
}
