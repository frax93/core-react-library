import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { HttpLoadingProvider, useHttpLoading } from './index';

const wrapper = ({ children }: { children: React.ReactElement }) => (
  <HttpLoadingProvider>{children}</HttpLoadingProvider>
);

describe('useHttpLoading', () => {
  it('throws when used outside its provider', () => {
    expect(() => renderHook(() => useHttpLoading())).toThrow(/no provider/i);
  });

  it('tracks loading via reference counting', () => {
    const { result } = renderHook(() => useHttpLoading(), { wrapper });

    expect(result.current.isLoading).toBe(false);

    act(() => result.current.addLoading());
    expect(result.current.isLoading).toBe(true);

    act(() => result.current.addLoading());
    act(() => result.current.removeLoading());
    expect(result.current.isLoading).toBe(true); // still one pending

    act(() => result.current.removeLoading());
    expect(result.current.isLoading).toBe(false);
  });

  it('never goes below zero', () => {
    const { result } = renderHook(() => useHttpLoading(), { wrapper });

    act(() => result.current.removeLoading());
    expect(result.current.isLoading).toBe(false);
  });
});
