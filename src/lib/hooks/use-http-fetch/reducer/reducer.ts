import { Canceler } from 'axios';
import { ActionsFetchReducer } from './actions';
import { HttpBackendError } from '../http-error';

export interface RestAPIState<Response> {
  hasErrors: boolean;
  loadingCount: number;
  isLoading?: boolean;
  pristine: boolean;
  data?: Response;
  abort?: Canceler;
  error?: Error | HttpBackendError;
  aborted?: boolean;
}

export interface ActionsRestAPI<Response> {
  type: ActionsFetchReducer;
  payload?: Response;
  error?: Error | HttpBackendError;
  abort?: Canceler;
}

/**
 * the reducer for rest request
 * @param {object} state the state
 * @param {string} action the action
 * @returns {object} the new object state
 */
export const restApiReducer = <Response>(
  state: RestAPIState<Response>,
  action: ActionsRestAPI<Response>
): RestAPIState<Response> => {
  switch (action.type) {
    case ActionsFetchReducer.REQUEST_INIT:
      return {
        ...state,
        hasErrors: false,
        loadingCount: (state.loadingCount += 1),
        abort: action.abort,
        pristine: false,
      };
    case ActionsFetchReducer.REQUEST_SUCCESS:
      return {
        ...state,
        loadingCount: (state.loadingCount -= 1),
        hasErrors: false,
        data: action.payload || undefined,
      };
    case ActionsFetchReducer.REQUEST_ERROR:
      return {
        ...state,
        data: undefined,
        loadingCount: (state.loadingCount -= 1),
        hasErrors: true,
        error: action.error,
      };
    case ActionsFetchReducer.REQUEST_ERROR_ABORT:
      return {
        ...state,
        data: undefined,
        aborted: true,
        error: action.error,
      };
    default:
      return state;
  }
};
