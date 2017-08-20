import Builder from './Builder'

import { randomInt } from './util';

const QUEUE_COMMON = Symbol();

/**
 * DelayedJobQueue is an important type that powers the rate-limiting domain-dependent feature
 * of WebContext as well as the `delayRandom` Observable extension. It is a builder which takes
 * a delay in milliseconds, and returns a queue with an "add" method that takes a value and a callback.  The callback/value set will be placed in a queue and will be executed such that executions are always [delayMs, delayMs + delayRandomMs) apart.
 *
 * The DelayedJobQueue executions use a common queue internally by default, but can also be partitioned
 * by a key that is mapped from the value, if the `keyForValue` function is provided to the Builder.  This allows, for example, separate rate-limited queues based on the domain of a URL, for fetch operations.
 *
 * Builder Methods:
 * delayMs | (delayMs:integer) => Builder | Set the minimum delay in milliseconds between queue executions
 * delayRandomMs | (delayRandomMs:integer) => Builder | Set the upper boundary of the delay in milliseconds
 * keyForValue | (keyForValue:(value:any)=>string) => Builder | Set a mapping function used to generate a key from the enqueued value for queue partitioning |
 *
 * Instance Methods:
 * add | (value:any, cb:(any)=>any) => void | Enqueue a value and callback for delayed execution.  The value may be used to generate a queue-partitioning key, and will be provided to the callback as the only argument |
 */
const DelayedJobQueue = Builder.of('delayMs,delayRandomMs,keyForValue', ({delayMs, delayRandomMs = 0, keyForValue = null}) => {

  const queues = {};
  const initQueue = (key) => {
    queues[key] = {
      lastJobMs: 0,
      queue: [],
    };
  };
  initQueue(QUEUE_COMMON);

  const execAsync = (value, cb) => setTimeout(() => cb(value), 0);

  const dequeue = (key) => {
    const queue = queues[key].queue;
    const [value, cb] = queue.shift();
    queues[key].lastJobMs = Date.now();
    execAsync(value, cb);
    if (queue.length) {
      scheduleDeque(key);
    }
  };

  const getJobTimeoutMs = (key) => {
    const noJobsYet = !queues[key].lastJobMs;
    if (noJobsYet) {
      return 0;
    }
    const timeDiffMs = Date.now() - queues[key].lastJobMs;
    return delayMs + randomInt(0, delayRandomMs) + timeDiffMs;
  };

  const scheduleDeque = (key) => {
    setTimeout(() => dequeue(key), getJobTimeoutMs(key));
  };

  return {
    add: (value, cb) => {
      const key = (keyForValue ? keyForValue(key) : null) || QUEUE_COMMON;
      if (!queues[key]) {
        initQueue(key);
      }
      const queue = queues[key].queue;
      const dequeueAlreadyScheduled = queue.length === 0;
      queue.push([value, cb]);
      if (!dequeueAlreadyScheduled) {
        scheduleDequeue(key);
      }
      if (!queues[key].lastJobMs) {
        queues[key].lastJobMs = Date.now();
      }
    }
  };
});
