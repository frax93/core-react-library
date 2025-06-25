import { useContext } from 'react';
import { ErrorStatus, ErrorStatusContext } from './error-provider';

/**
 * A custom hook to quickly read the context's value.
 * @returns {object} the object
 */
export const useErrorHandler = (): ErrorStatus => {
  return useContext(ErrorStatusContext);
};
