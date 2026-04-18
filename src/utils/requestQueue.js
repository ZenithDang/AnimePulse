/**
 * Limits the number of async tasks running concurrently.
 * Callers await run(fn) — excess calls queue and are dispatched
 * as running slots free up.
 */
class ConcurrencyLimiter {
  constructor(limit = 3) {
    this.limit   = limit;
    this.running = 0;
    this.queue   = [];
  }

  run(fn) {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        this.running++;
        try {
          resolve(await fn());
        } catch (err) {
          reject(err);
        } finally {
          this.running--;
          if (this.queue.length > 0) {
            this.queue.shift()();
          }
        }
      };

      if (this.running < this.limit) {
        execute();
      } else {
        this.queue.push(execute);
      }
    });
  }
}

// Shared queue for all AniList API requests — max 3 concurrent
export const apiQueue = new ConcurrencyLimiter(3);
