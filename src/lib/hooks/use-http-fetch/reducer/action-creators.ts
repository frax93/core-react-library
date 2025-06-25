import { Canceler } from 'axios';
import { ActionsFetchReducer } from './actions';
import { ActionsRestAPI } from './reducer';
import { HttpBackendError } from '../http-error';

/**
 * The action to dispatch when a request starts.
 * @returns {object} the object with type of action
 */
export const requestInit = <Response>(abortController?: Canceler): ActionsRestAPI<Response> => ({
  type: ActionsFetchReducer.REQUEST_INIT,
  abort: abortController,
});

/**
 * The action to dispatch when a request completes successfully.
 * @param {Response} payload the payload
 * @returns {object} the object with type of action
 */
export const requestSuccess = <Response>(payload: Response): ActionsRestAPI<Response> => ({
  type: ActionsFetchReducer.REQUEST_SUCCESS,
  payload,
});

/**
 * The action to dispatch when the request goes in error.
 * @param {Error | HttpBackendError} error the payload
 * @returns {object} the object with type of action
 */
export const requestError = <Response>(
  error: Error | HttpBackendError
): ActionsRestAPI<Response> => ({
  type: ActionsFetchReducer.REQUEST_ERROR,
  error,
});

/**
 * The action to dispatch when the request goes in error.
 * @param {Error | HttpBackendError} error the payload
 * @returns {object} the object with type of action
 */
export const requestErrorAbort = <Response>(
  error: Error | HttpBackendError
): ActionsRestAPI<Response> => ({
  type: ActionsFetchReducer.REQUEST_ERROR,
  error,
});
