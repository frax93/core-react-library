import { useCallback } from 'react';
import { usePromises } from '../use-promises';
import generatePromise, { PromiseErrorInterface } from '../../utils/generate-promise';
import delay from '../../utils/delay';

/**
 * A hook to prevent click on double click
 * @param {Function} onClick the handler for click event
 * @param {Function} onDoubleClick the handler for double click event
 * @param {number} delayTime the delay time to prevent click
 * @returns {Function[]} an array of function
 */
export const usePreventionDoubleClick = <T>(
  onClick: (...parameters: T[]) => void,
  onDoubleClick: (...parameters: T[]) => void,
  delayTime = 300,
): ((...parameters: T[]) => void)[] => {
  const promiseApi = usePromises();
  /**
   * The function to trigger on click cancelling other events
   * @param {*} parameters the parameters of the function
   */
  const handleClick = useCallback(
    (...parameters: T[]): void => {
      promiseApi.clearPendingPromises();
      const waitForClick = generatePromise(delay(delayTime));
      promiseApi.appendPendingPromise(waitForClick);

      waitForClick.promise
        .then(() => {
          promiseApi.removePendingPromise(waitForClick);
          onClick(...parameters);
        })
        .catch((error: PromiseErrorInterface) => {
          promiseApi.removePendingPromise(waitForClick);
          if (!error.isCanceled) {
            throw error.message;
          }
        });
    },
    [promiseApi, onClick, delayTime],
  );

  /**
   * The function to trigger on double click cancelling other events
   * @param {*} parameters the parameters of the function
   */
  const handleDoubleClick = useCallback(
    (...parameters: T[]) => {
      promiseApi.clearPendingPromises();
      onDoubleClick(...parameters);
    },
    [promiseApi, onDoubleClick],
  );

  return [handleClick, handleDoubleClick];
};
