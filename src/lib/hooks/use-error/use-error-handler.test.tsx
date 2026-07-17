import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { ErrorHandlerProvider } from './error-provider';
import { useErrorHandler } from './use-error-handler';
import { HttpBackendError } from '../use-http-fetch/http-error';
import { HttpStatusCode } from '../use-http-fetch/http-status-code';

const wrapper = ({ children }: { children: React.ReactElement }) => (
  <ErrorHandlerProvider>{children}</ErrorHandlerProvider>
);

describe('useErrorHandler', () => {
  it('exposes a no-op setError by default (no provider)', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.error).toBeUndefined();
    expect(() => result.current.setError()).not.toThrow();
  });

  it('stores and exposes the current error through the provider', () => {
    const { result } = renderHook(() => useErrorHandler(), { wrapper });

    const error = new HttpBackendError(500, ['boom'], HttpStatusCode.InternalServerError);
    act(() => result.current.setError(error));

    expect(result.current.error).toBe(error);
    expect(result.current.error?.messages).toEqual(['boom']);
  });
});
