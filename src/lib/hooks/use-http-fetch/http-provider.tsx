import React, { createContext, ReactElement, ReactNode, useMemo, useRef } from 'react';
import axiosLibrary, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';
import { RequestOptions, RequestOptionsOverride } from './stateless/type';

/**
 * Default request options.
 */
export const defaultOptions: RequestOptionsOverride = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

export const AxiosIntanceContext = createContext<AxiosInstance>(axiosLibrary);

interface RequestInterceptors<T> {
  onFulfilled?:
    | ((
        value: AxiosRequestConfig<T>,
      ) =>
        | InternalAxiosRequestConfig<T>
        | Promise<InternalAxiosRequestConfig<T>>
        | AxiosRequestConfig<T>)
    | undefined;
  onRejected?: ((error: AxiosError) => AxiosError<T> | Promise<AxiosError<T>>) | undefined;
}

interface ResponseInterceptors<T> {
  onFulfilled?:
    | ((value: AxiosResponse<T>) => AxiosResponse<T> | Promise<AxiosResponse<T>>)
    | undefined;
  onRejected?: ((error: AxiosError) => AxiosError<T> | Promise<AxiosError<T>>) | undefined;
}

interface HttpProviderProps<T> {
  children: ReactElement | ReactElement[] | ReactNode;
  requestInterceptors: RequestInterceptors<T>;
  responseInterceptors: ResponseInterceptors<T>;
  baseUrl?: string;
  options?: RequestOptions;
}

interface HttpProviderProps<T> {
  children: ReactElement | ReactElement[] | ReactNode;
  requestInterceptors: RequestInterceptors<T>;
  responseInterceptors: ResponseInterceptors<T>;
  baseUrl?: string;
  options?: RequestOptions;
}

/**
 * Http provider custom based on axios
 * @param {HttpProviderProps<T>} root the interface of the object
 * @param {ReactElement | ReactElement[] | ReactNode} children the children prop
 * @param {RequestInterceptors<T>} requestInterceptors the functions of request interceptors
 * @param {ResponseInterceptors<T>} responseInterceptors the functions of response interceptors
 * @param {RequestOptionsOverride | undefined} options the general options
 * @param {string | undefined} baseUrl the base url
 * @returns {ReactElement} the context for axios hooks
 */
export const HttpProvider = <T,>({
  children,
  requestInterceptors,
  responseInterceptors,
  options = defaultOptions,
  baseUrl = '',
}: HttpProviderProps<T>): ReactElement => {
  const axoisRequestRef = useRef<number>(0);
  const axiosResponseRef = useRef<number>(0);
  const axios = useMemo(() => {
    const axiosInstance = axiosLibrary.create({
      ...options,
      baseURL: baseUrl,
    });
 axoisRequestRef.current = axiosInstance.interceptors.request.use(
      requestInterceptors.onFulfilled as (
        value: AxiosRequestConfig<T>,
      ) => InternalAxiosRequestConfig<T> | Promise<InternalAxiosRequestConfig<T>>,
      requestInterceptors.onRejected,
    );

    axiosResponseRef.current = axiosInstance.interceptors.response.use(
      responseInterceptors.onFulfilled,
      responseInterceptors.onRejected,
    );
    return axiosInstance;
  }, [baseUrl, options, requestInterceptors, responseInterceptors]);



  return <AxiosIntanceContext.Provider value={axios}>{children}</AxiosIntanceContext.Provider>;
};

HttpProvider.displayName = 'Http provider';
