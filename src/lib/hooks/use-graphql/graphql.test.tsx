import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { HttpProvider } from '../use-http-fetch/http-provider';
import { useGraphQLClient } from './stateless';
import { useGraphQLFetch } from './index';

const { mockInstance } = vi.hoisted(() => {
  const instance = vi.fn(() => Promise.resolve({ data: { data: { value: 1 } } })) as ReturnType<
    typeof vi.fn
  > & { interceptors: unknown };
  instance.interceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  };
  return { mockInstance: instance };
});

vi.mock('axios', () => ({
  default: Object.assign(function axiosDefault() {}, {
    create: () => mockInstance,
    CancelToken: { source: () => ({ token: {}, cancel: vi.fn() }) },
  }),
}));

const wrapper = ({ children }: { children: React.ReactElement }) => (
  <HttpProvider baseUrl="https://api.test" requestInterceptors={{}} responseInterceptors={{}}>
    {children}
  </HttpProvider>
);

describe('GraphQL hooks', () => {
  beforeEach(() => mockInstance.mockClear());

  it('useGraphQLClient POSTs the query to the configured endpoint', async () => {
    const { result } = renderHook(
      () => useGraphQLClient('query { me }', { endpoint: '/gql', variables: { id: 1 } }),
      { wrapper }
    );

    await act(async () => {
      await result.current();
    });

    const [[config]] = mockInstance.mock.calls;
    expect(config).toMatchObject({
      url: '/gql',
      method: 'POST',
      data: { query: 'query { me }', variables: { id: 1 } },
    });
  });

  it('useGraphQLFetch unwraps response.data.data by default', async () => {
    const { result } = renderHook(
      () => useGraphQLFetch<{ value: number }>('query { v }', { onBootstrap: true }),
      { wrapper }
    );

    await waitFor(() => expect(result.current[0].isLoading).toBe(false));
    expect(result.current[0].data).toEqual({ value: 1 });
  });
});
