import { AxiosResponse, Canceler, AxiosRequestConfig } from 'axios';

export type RequestOptionsOverride = Omit<AxiosRequestConfig, 'baseURL'>;

export interface RequestOptions extends RequestOptionsOverride {
  errorCatching?: boolean;
  successCatching?: boolean;
  abortable?: boolean;
  loading?: boolean;
}

export type Response<T = never> = AxiosResponse<T> & {
  config: RequestOptions;
};

export interface HttpFetchParameters<BackendResponse, TransformerResponse> {
  transformer?: (response: AxiosResponse<BackendResponse>) => TransformerResponse;
  options?: RequestOptions;
}

export type ResponsePromise<BackendResponse, TransformerResponse = undefined> = Promise<
  AxiosResponse<BackendResponse> | TransformerResponse
>;

export type ResponseAbortable<BackendResponse, TransformerResponse = undefined> = [
  ResponsePromise<BackendResponse, TransformerResponse>,
  Canceler,
];

export type HttpPromise<BackendResponse, TransformerResponse = undefined> = (
  requestOptions?: RequestOptionsOverride,
) => ResponsePromise<BackendResponse, TransformerResponse>;

export type HttpPromiseAbortable<BackendResponse, TransformerResponse = undefined> = (
  requestOptions?: RequestOptionsOverride,
) => ResponseAbortable<BackendResponse, TransformerResponse>;

export type HttpRequestFunction<BackendResponse, TransformerResponse = undefined> = (
  requestOptions?: RequestOptionsOverride,
) =>
  | ResponseAbortable<BackendResponse, TransformerResponse>
  | ResponsePromise<BackendResponse, TransformerResponse>;
