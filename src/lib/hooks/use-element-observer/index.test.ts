import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useElementScrollWidthObserver } from './index';

// Provide a lightweight ResizeObserver stub so the hook does not rely on the
// polyfill's animation-frame loop during the test.
beforeEach(() => {
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

function elementWith(scrollWidth: number, clientWidth: number): HTMLElement {
  const el = document.createElement('div');
  Object.defineProperty(el, 'scrollWidth', { value: scrollWidth, configurable: true });
  Object.defineProperty(el, 'clientWidth', { value: clientWidth, configurable: true });
  return el;
}

describe('useElementScrollWidthObserver', () => {
  it('returns false for a null element', () => {
    const { result } = renderHook(() => useElementScrollWidthObserver(null));
    expect(result.current).toBe(false);
  });

  it('detects horizontal overflow on mount', () => {
    const { result } = renderHook(() => useElementScrollWidthObserver(elementWith(200, 100)));
    expect(result.current).toBe(true);
  });

  it('reports no overflow when content fits', () => {
    const { result } = renderHook(() => useElementScrollWidthObserver(elementWith(100, 100)));
    expect(result.current).toBe(false);
  });
});
