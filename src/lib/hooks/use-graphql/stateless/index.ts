import { AxiosResponse } from 'axios';
import { HttpRequestFunction, RequestOptions } from '../../use-http-fetch/stateless/type';
import { useHttpClient } from '../../use-http-fetch/stateless';


type GraphQLVariables = Record<string, unknown>;

interface GraphQLPayload {
  query: string;
  variables?: GraphQLVariables;
}

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string; [key: string]: unknown }>;
}

interface UseGraphQLClientOptions<T> {
  variables?: GraphQLVariables;
  options?: Partial<RequestOptions>;
  transformer?: (response: AxiosResponse<GraphQLResponse<T>>) => T;
  /** GraphQL endpoint to POST to. Defaults to `/graphql`. */
  endpoint?: string;
}

/**
 * Stateless GraphQL client using useHttpClient under the hood.
 * @param query GraphQL query string
 * @param config Optional config (variables, endpoint, options, transformer)
 * @returns A callable function to execute the GraphQL request
 */
export function useGraphQLClient<T = unknown>(
  query: string,
  {
    variables,
    options,
    endpoint = '/graphql',
    transformer = (res) => res.data.data,
  }: UseGraphQLClientOptions<T> = {}
): HttpRequestFunction<GraphQLResponse<T>, T> {
  const payload: GraphQLPayload = { query, variables };

  return useHttpClient<GraphQLResponse<T>, T>(endpoint, {
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
