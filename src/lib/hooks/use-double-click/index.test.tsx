import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePreventionDoubleClick } from './index';

describe('usePreventionDoubleClick', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires onClick after the delay when there is no double click', async () => {
    const onClick = vi.fn();
    const onDoubleClick = vi.fn();

    const { result } = renderHook(() => usePreventionDoubleClick(onClick, onDoubleClick, 300));

    act(() => result.current[0]());
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onDoubleClick).not.toHaveBeenCalled();
  });

  it('cancels the pending click when a double click happens', async () => {
    const onClick = vi.fn();
    const onDoubleClick = vi.fn();

    const { result } = renderHook(() => usePreventionDoubleClick(onClick, onDoubleClick, 300));

    act(() => result.current[0]()); // single click scheduled
    act(() => result.current[1]()); // double click cancels it

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(onDoubleClick).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
