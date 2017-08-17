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
}
