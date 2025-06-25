import { useRef, useCallback } from 'react';

interface PromiseResult {
  appendPendingPromise: (promise: unknown) => void;
  removePendingPromise: (promise: unknown) => void;
  clearPendingPromises: () => void;
}

/**
 * Hook to make cancellable a promise
 * @returns {object} the function to interact with a promise
 */
export const usePromises = (): PromiseResult => {
  const pendingPromises = useRef<unknown[]>([]);

  /**
   * The function to add a new promise
   * @param {*} promise the promise to append
   */
  const appendPendingPromise = useCallback((promise: unknown) => {
    pendingPromises.current = [...pendingPromises.current, promise];
  }, []);

  /**
   * The function to remove a promise
   * @param {*} promise the promise to remove
   */
  const removePendingPromise = useCallback((promise: unknown) => {
    pendingPromises.current = pendingPromises.current.filter(
      (promiseItem) => promiseItem !== promise,
    );
  }, []);

  /**
   * The function to remove a promise
   */
  const clearPendingPromises = useCallback(() => {
    pendingPromises.current.forEach((promise) => (promise as Promise<unknown>).then());
  }, []);

  return {
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises,
  };
};
