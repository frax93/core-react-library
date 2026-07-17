import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClickOutside } from './index';

describe('useClickOutside', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('calls the handler on a mousedown outside the referenced element', () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    const inside = document.createElement('div');
    const outside = document.createElement('div');
    document.body.append(inside, outside);
    (result.current[0] as { current: HTMLElement | null }).current = inside;

    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call the handler when clicking inside the element', () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    const inside = document.createElement('div');
    const child = document.createElement('span');
    inside.appendChild(child);
    document.body.append(inside);
    (result.current[0] as { current: HTMLElement | null }).current = inside;

    child.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
  });
});
