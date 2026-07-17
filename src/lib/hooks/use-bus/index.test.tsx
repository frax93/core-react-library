import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { Provider, useBus, useListener } from './index';

const wrapper = ({ children }: { children: React.ReactNode }) => <Provider>{children}</Provider>;

describe('useBus / useListener', () => {
  it('delivers emitted events to registered listeners', () => {
    const listener = vi.fn();

    const { result } = renderHook(
      () => {
        useListener<number>('my-event', listener);
        return useBus();
      },
      { wrapper }
    );

    act(() => result.current.emit('my-event', 42));

    expect(listener).toHaveBeenCalledWith(42);
  });

  it('stops delivering to a handler after off()', () => {
    const listener = vi.fn();
    const { result } = renderHook(() => useBus(), { wrapper });

    act(() => result.current.on('evt', listener));
    act(() => result.current.emit('evt', 1));
    expect(listener).toHaveBeenCalledTimes(1);

    act(() => result.current.off('evt', listener));
    act(() => result.current.emit('evt', 2));
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
