import { describe, it, expect, vi } from 'vitest';
import debounce from './debounce';

describe('debounce', () => {
  it('invokes the callback only once after rapid calls', () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounce<string>(callback, 200);

    debounced('a');
    debounced('b');
    debounced('c');
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('c');
    vi.useRealTimers();
  });
});
