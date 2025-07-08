import { AxiosResponse } from 'axios';
import { useHttpFetch } from '../use-http-fetch';
import { RequestOptions } from '../use-http-fetch/stateless/type';

type GraphQLVariables = Record<string, unknown>;

type GraphQLPayload = {
  query: string;
  variables?: GraphQLVariables;
};

type GraphQLResponse<T> = {
  data: T;
  errors?: Array<{ message: string; [key: string]: unknown }>;
};

type GraphQLRequestOptions = Partial<RequestOptions>;

interface UseGraphQLFetchOptions<TData> {
  variables?: GraphQLVariables;
  initialData?: TData;
  onBootstrap?: boolean;
  options?: GraphQLRequestOptions;
  transformer?: (response: AxiosResponse<GraphQLResponse<TData>>) => TData,
}

export function useGraphQLFetch<TData = unknown>(
  query: string,
  {
    variables,
    initialData,
    onBootstrap = false,
    options,
    transformer = (response) => response.data.data,
  }: UseGraphQLFetchOptions<TData> = {}
) {
  const payload: GraphQLPayload = { query, variables };

  return useHttpFetch<GraphQLResponse<TData>, TData>('/api/graphql', {
    onBootstrap,
    initialData,
    transformer,
    options: {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      data: payload,
    },
  });
}
