import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { HttpProvider } from './http-provider';
import { useHttpProviderContext } from './use-http-provider-context';
import { useHttpClient } from './stateless';
import { useHttpFetch } from './index';

// A single fake Axios instance shared by the mocked module.
const { mockInstance } = vi.hoisted(() => {
  const instance = vi.fn(() => Promise.resolve({ data: { hello: 'world' } })) as ReturnType<
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

describe('HTTP layer', () => {
  beforeEach(() => {
    mockInstance.mockClear();
  });

  it('useHttpProviderContext returns the axios instance built by the provider', () => {
    const { result } = renderHook(() => useHttpProviderContext(), { wrapper });
    expect(result.current).toBe(mockInstance);
  });

  it('useHttpClient issues a request to the given url', async () => {
    const { result } = renderHook(() => useHttpClient('/items'), { wrapper });

    await act(async () => {
      await result.current();
    });

    expect(mockInstance).toHaveBeenCalledTimes(1);
    expect(mockInstance.mock.calls[0][0]).toMatchObject({ url: '/items' });
  });

  it('useHttpFetch fetches on bootstrap and exposes the transformed data', async () => {
    const { result } = renderHook(
      () =>
        useHttpFetch<{ hello: string }, { hello: string }>('/items', {
          onBootstrap: true,
          transformer: (res) => res.data,
          options: { method: 'GET' },
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current[0].isLoading).toBe(false));

    expect(mockInstance).toHaveBeenCalled();
    expect(result.current[0].hasErrors).toBe(false);
    expect(result.current[0].data).toEqual({ hello: 'world' });
  });
});
