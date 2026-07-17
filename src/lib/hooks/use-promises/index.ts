import { useRef, useCallback } from 'react';

/**
 * A pending, cancelable promise (as produced by `generatePromise`).
 */
export interface CancelablePromise {
  promise: Promise<unknown>;
  cancel: () => void;
}

interface PromiseResult {
  appendPendingPromise: (promise: CancelablePromise) => void;
  removePendingPromise: (promise: CancelablePromise) => void;
  clearPendingPromises: () => void;
}

/**
 * Hook to make cancellable a promise
 * @returns {object} the function to interact with a promise
 */
export const usePromises = (): PromiseResult => {
  const pendingPromises = useRef<CancelablePromise[]>([]);

  /**
   * The function to add a new promise
   * @param {CancelablePromise} promise the promise to append
   */
  const appendPendingPromise = useCallback((promise: CancelablePromise) => {
    pendingPromises.current = [...pendingPromises.current, promise];
  }, []);

  /**
   * The function to remove a promise
   * @param {CancelablePromise} promise the promise to remove
   */
  const removePendingPromise = useCallback((promise: CancelablePromise) => {
    pendingPromises.current = pendingPromises.current.filter(
      (promiseItem) => promiseItem !== promise,
    );
  }, []);

  /**
   * Cancels every pending promise and empties the queue.
   */
  const clearPendingPromises = useCallback(() => {
    pendingPromises.current.forEach((promise) => promise.cancel());
    pendingPromises.current = [];
  }, []);

  return {
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises,
  };
};
