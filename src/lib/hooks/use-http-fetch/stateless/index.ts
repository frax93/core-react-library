import axiosLib, { AxiosPromise, AxiosResponse } from 'axios';
import { useCallback, useMemo } from 'react';
import { useHttpProviderContext } from '../use-http-provider-context';
import {
  HttpFetchParameters,
  HttpRequestFunction,
  RequestOptions,
  RequestOptionsOverride,
  ResponseAbortable,
  ResponsePromise,
} from './type';

/**
 * A custom hook to interact with Restful backend API
 * in a stateless way.
 * @param {string} url the url of the endpoint
 * @param {HttpRestParameters} fetchParameters the parameters of the hook
 * @param {Function} fetchParameters.transformer function to map the response
 * @param {RequestOptions} fetchParameters.options options to pass to the request
 * @param {boolean} fetchParameters.options.abortable the request is abortable
 * @param {boolean} fetchParameters.options.errorCatching the request has default catching
 * @returns {Function} the function to do the request
 */
export const useHttpClient = <BackendResponse = undefined, TransformerResponse = undefined>(
  url: string,
  fetchParameters: HttpFetchParameters<BackendResponse, TransformerResponse> = {
    options: {
      errorCatching: true,
      loading: true,
    },
  }
): HttpRequestFunction<BackendResponse, TransformerResponse> => {
  const axios = useHttpProviderContext();

  const parameters: HttpFetchParameters<BackendResponse, TransformerResponse> = useMemo(() => {
    return {
      onBootstrap: true,
      ...fetchParameters,
      options: { errorCatching: true, loading: true, ...fetchParameters.options },
    };
  }, [fetchParameters]);

  /**
   * Transform the result if needed
   * @param {AxiosPromise<BackendResponse>} promise the promise with response type
   */
  const transformResult = useCallback(
    (promise: AxiosPromise<BackendResponse>) => {
      return promise.then((promiseResponse: AxiosResponse<BackendResponse>) => {
        const response = promiseResponse;

        if (parameters?.transformer) {
          const transformedResponse = parameters?.transformer(
            promiseResponse
          ) as unknown as TransformerResponse;
          return transformedResponse;
        }

        return response;
      });
    },
    [parameters?.transformer]
  );

  const makeRequest = useCallback(
    (requestOptions?: RequestOptions) => {
      const httpRequestOptions = requestOptions || {};

      const mergedOptions: RequestOptionsOverride = {
        ...(parameters?.options || {}),
        ...httpRequestOptions,
        url: `${url}${httpRequestOptions.url || ''}`,
      };

      if (parameters?.options?.abortable) {
        const abortController = axiosLib.CancelToken.source();

        const promise = axios({
          ...mergedOptions,
          cancelToken: abortController.token,
        });

        const transformedResponse = transformResult(promise);

        return [transformedResponse, abortController.cancel] as ResponseAbortable<
          BackendResponse,
          TransformerResponse
        >;
      }

      return transformResult(axios(mergedOptions)) as ResponsePromise<
        BackendResponse,
        TransformerResponse
      >;
    },
    [parameters?.options, axios, transformResult]
  );

  return makeRequest;
};
