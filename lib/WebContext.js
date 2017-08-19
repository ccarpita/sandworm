import Builder from './Builder';

const WebContext = Builder.of('delay,delayRandom,limit', ({ delay, delayRandom, limit }) => {
  let visited = 0;
  return {
    delay: () => delay,
    delayRandom: () => delayRandom,
    limit: () => limit,
    visited: () => visited,
    increment: () => {
      visited += 1;
    },
  };
});
export default WebContext;
