import { useRef, useEffect, useReducer, useMemo, useCallback } from 'react';
import { HttpBackendError } from './http-error';
import { Canceler } from 'axios';
import {
  requestInit,
  requestSuccess,
  requestError,
  requestErrorAbort,
} from './reducer/action-creators';
import {
  HttpFetchParameters,
  HttpRequestFunction,
  RequestOptions,
} from './stateless/type';
import { useHttpClient } from './stateless';
import { restApiReducer, RestAPIState } from './reducer/reducer';

interface HttpFetchParametersExtended<BackendResponse, TransformerResponse>
  extends HttpFetchParameters<BackendResponse, TransformerResponse> {
  initialData?: BackendResponse | TransformerResponse;
  options?: RequestOptions;
  onBootstrap?: boolean;
}

type HttpResponse<BackendResponse, TransformerResponse = undefined> = [
  RestAPIState<
    BackendResponse | TransformerResponse | [BackendResponse | TransformerResponse, Canceler]
  >,
  (
    | HttpRequestFunction<BackendResponse, TransformerResponse>
    | ((options?: RequestOptions) => Promise<Error | HttpBackendError>)
  )
];

/**
 * A custom hook to interact with Restful backend API
 * in a statefull way.
 * @param {object} url the url of the request
 * @param {HttpFetchParametersExtended} fetchParameters the options of the request HTTP
 * @param {boolean} fetchParameters.onBootstrap to start the fetch at the mount of the component (useEffect)
 * @param {Function} fetchParameters.transformer function to map the response
 * @param {object} fetchParameters.initialData the initial data of the request
 * @param {boolean} fetchParameters.options the options of the stateless http-client
 * @returns {object[]} the state and the function to do the request
 */
export const useHttpFetch = <BackendResponse, TransformerResponse = undefined>(
url = '', fetchParameters: HttpFetchParametersExtended<BackendResponse, TransformerResponse> = {
    onBootstrap: true,
    options: {
        errorCatching: true,
        loading: true,
    },
}): HttpResponse<BackendResponse, TransformerResponse> => {
  const [state, dispatch] = useReducer(restApiReducer, {
    pristine: true,
    loadingCount: 0,
    hasErrors: false,
    data: fetchParameters?.initialData,
  });

  // The hook to perform a stateless Rest API request.
  const makeRequest = useHttpClient(url, {
    onBootstrap: true,
    ...fetchParameters,
    options: { errorCatching: true, loading: true, ...fetchParameters.options },
  });

  // Tells if the component is actually mounted or not.
  const isMounted = useRef(true);

  /**
   * The effect to keep track of mounting and
   * unmounting of the component.
   */
  useEffect(() => {
    isMounted.current = true;

    if (fetchParameters?.onBootstrap) {
      performRequest(fetchParameters.options);
    }

    return () => {
      isMounted.current = false;
    };
  }, [fetchParameters?.onBootstrap]);

  /**
   * Perform the rest request with the passed options
   * @param {object} options the options of the request HTTP
   * @param {object} options.data to set the POST Body
   * @param {object} options.headers to set the header of the request
   * @param {string} options.method to set the method HTTP
   * @param {object} options.params to set the query string params HTTP
   * @returns {object} the response
   */
  const performRequest = useCallback((options?: RequestOptions) => {
    /**
     * Dispatch the action handling the initialization of the request.
     */

    if (fetchParameters.options?.abortable) {
      const request = makeRequest(options);

      const [result, abort] = request as [Promise<BackendResponse | TransformerResponse>, Canceler];

      dispatch(requestInit(abort));

      return result
        .then((result1) => {
          if (isMounted.current) {
            /**
             * Dispatch the action handling the errored request.
             */
            dispatch(requestSuccess(result1));
            return result1;
          }
        })
        .catch((error) => {
          if (isMounted.current) {
            const errorDispatcher = requestErrorAbort;
            /**
             * Dispatch the action handling the errored request.
             */
            dispatch(errorDispatcher(error as Error | HttpBackendError));
          }
          throw error as Error | HttpBackendError;
        });
    }

    const request = makeRequest(options);

    const httpRequest = request as Promise<BackendResponse | TransformerResponse>;

    dispatch(requestInit());

    return httpRequest
      .then((response) => {
        if (isMounted.current) {
          /**
           * Dispatch the action handling the successfull request.
           */
          dispatch(requestSuccess(response as BackendResponse | TransformerResponse));
        }

        return response;
      })
      .catch((error) => {
        if (isMounted.current) {
          /**
           * Dispatch the action handling the errored request.
           */
          dispatch(requestError(error as Error | HttpBackendError));
        }
        throw error as Error | HttpBackendError;
      });
  }, [dispatch, makeRequest, fetchParameters.options?.abortable]);

  const httpState = useMemo(() => {
    const fetchState = { ...state, isLoading: state.loadingCount > 0 };

    return [fetchState, performRequest] as HttpResponse<BackendResponse, TransformerResponse>;
  }, [state, performRequest]);

  return httpState;
};
