import { describe, it, expect, vi } from 'vitest';
import delay from './delay';

describe('delay', () => {
  it('resolves after the given amount of time', async () => {
    vi.useFakeTimers();
    const spy = vi.fn();

    const promise = delay(1000).then(spy);
    expect(spy).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);
    await promise;

    expect(spy).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
