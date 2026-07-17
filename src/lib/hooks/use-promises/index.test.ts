import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePromises } from './index';

const cancelable = () => ({ promise: Promise.resolve(), cancel: vi.fn() });

describe('usePromises', () => {
  it('cancels all pending promises on clear', () => {
    const { result } = renderHook(() => usePromises());
    const a = cancelable();
    const b = cancelable();

    act(() => {
      result.current.appendPendingPromise(a);
      result.current.appendPendingPromise(b);
      result.current.clearPendingPromises();
    });

    expect(a.cancel).toHaveBeenCalledTimes(1);
    expect(b.cancel).toHaveBeenCalledTimes(1);
  });

  it('does not cancel a promise that was removed first', () => {
    const { result } = renderHook(() => usePromises());
    const a = cancelable();

    act(() => {
      result.current.appendPendingPromise(a);
      result.current.removePendingPromise(a);
      result.current.clearPendingPromises();
    });

    expect(a.cancel).not.toHaveBeenCalled();
  });
});
