import Rx from 'rxjs/Rx';

import { requireParam } from '../util';

import DelayedJobQueue from '../DelayedJobQueue';

/**
 * Generates an observable that contains the previous observables values
 * such that each value will be delayed a random interval _apart_ from
 * one another, where there interval is in the range [minTimeMs, maxTimeMs)
 *
 * The primary application of this is intended to be for making many requests
 * to a rate-limited service while avoiding thundering herd implicationes.
 *
 * @param {Integer} minTimeMs The minimum time to delay between value emissions, in ms
 * @param {Integer} maxTimeMs The maximum (non-inclusive) time to delay between value emissions
 *
 * @example
 *   Consider that each dash in the marble diagram is 1ms:
 *
 *   -ABC----------------------|->
 *
 *   .delayRandom(1, 15)
 *
 *   -----A----B------------C--|->
 */
Rx.Observable.prototype.delayRandom = function delayRandom$(minTimeMs, maxTimeMs) {
  requireParam('minTimeMs', minTimeMs);
  requireParam('maxTimeMs', maxTimeMs);
  if (maxTimeMs < minTimeMs) {
    throw new Error(`maxTimeMs must be greater than minTimeMs: ${maxTimeMs} < ${minTimeMs}`);
  }
  const jobQueue = DelayedJobQueue
      .delayMs(minTimeMs)
      .delayRandomMs(maxTimeMs - minTimeMs)
      .build();
  const sourceObservable = this;
  return Rx.Observable.create((observer) => {
    sourceObservable.subscribe({
      complete: () => observer.complete(),
      next: (value) => jobQueue.add(value, () => observer.next(value)),
      error: (err) => observer.error(err)
    });
  });
};

