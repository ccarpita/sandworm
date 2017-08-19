export function toList(any) {
  if (typeof any === 'string') {
    return any.split(/\s*,\s*/);
  }
  if (any === null || typeof any === 'undefined') {
    return [];
  }
  if (typeof any === 'object') {
    return Array.from(any);
  }
  return [any];
}

export function randomInt(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil)) + min;
}

export function requireParam(name, value) {
  if (!value) {
    throw new Error(`Required parameter missing: ${name}`);
  }
}

export function unimplemented(message) {
  return () => {
    throw new Error(`Unimplemented function: ${message}`);
  };
}
