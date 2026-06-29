import pRetry from "p-retry";

export async function withRetry<T>(fn: () => Promise<T>, taskName: string): Promise<T> {
  return pRetry(fn, {
    onFailedAttempt: (error) => {
      console.warn(`${taskName} attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`);
    },
    retries: 2,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 5000,
  });
}
