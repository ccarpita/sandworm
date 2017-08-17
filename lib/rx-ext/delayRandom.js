import Rx from 'rxjs/Rx';

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
 *   observable.delayRandom(1, 15)
 *
 *   -ABC----------------------|->
 *
 *   -----A----B------------C--|->
 */
Rx.Observable.prototype.delayRandom = function(minTimeMs, maxTimeMs) {
  requireParam('minTimeMs', minTimeMs);
  requireParam('maxTimeMs', maxTimeMs);

  let schedulePointMs = 0;
  let lastCallMs = Date.now();

  return this.delayWhen((value) => {
    Rx.Observable.create((notify) => {
      // Adjust for existing delays between the source observable
      const scheduleDiffMs = Date.now() - lastCallMs;
      schedulePointMs -= scheduleDiffMs;
      lastCallMs = Date.now();

      // Calculate a random delay and add it to the scheduled time
      const delayMs = randomInt(minTimeMs, maxTimeMs);
      schedulePointMs += delayMs;
      if (schedulePoint <= 0) {
        schedulePoint = 1;
      }
      setTimeout(() => {
        notify.next();
        notify.complete();
      }, schedulePoint);
    })
  });
}

function requireParam(name, value) {
  if (!name) {
    throw new Error('Required parameter missing: ' + name);
  }
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


