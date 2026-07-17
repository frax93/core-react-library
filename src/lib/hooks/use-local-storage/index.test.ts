import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useLocalStorage, { getFromLocalStorage, storeToLocalStorage } from './index';

describe('local storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('getFromLocalStorage returns the default value when the key is absent', () => {
    expect(getFromLocalStorage('missing', 'fallback')).toBe('fallback');
  });

  it('storeToLocalStorage + getFromLocalStorage round-trip a value', () => {
    storeToLocalStorage('key', { a: 1 });
    expect(getFromLocalStorage('key', null)).toEqual({ a: 1 });
  });

  it('getFromLocalStorage returns the default when parsing fails', () => {
    window.localStorage.setItem('bad', 'not-json');
    expect(getFromLocalStorage('bad', 'fallback')).toBe('fallback');
  });
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with the fallback value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));

    act(() => result.current[1]('updated'));

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(window.localStorage.getItem('key') as string)).toBe('updated');
  });
});
