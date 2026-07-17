import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StyleLoaderService } from './style-loader';

// Controls whether the injected elements simulate a successful load or an error.
let outcome: 'load' | 'error' = 'load';
let createSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  outcome = 'load';
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  const original = document.createElement.bind(document);
  createSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    const el = original(tag) as HTMLElement & {
      onload?: (e: Event) => void;
      onerror?: (e: Event) => void;
    };
    // Fire the relevant handler asynchronously, after the caller wires it up.
    setTimeout(() => {
      if (outcome === 'load') el.onload?.(new Event('load'));
      else el.onerror?.(new Event('error'));
    }, 0);
    return el;
  });
});

afterEach(() => createSpy.mockRestore());

describe('StyleLoaderService', () => {
  it('injects a stylesheet and a script for the given base url', async () => {
    await StyleLoaderService.loadStyles('https://cdn.test');

    expect(document.head.querySelector('link')?.getAttribute('href')).toBe(
      'https://cdn.test/styles.css'
    );
    expect(document.body.querySelector('script')?.getAttribute('src')).toBe(
      'https://cdn.test/scripts.js'
    );
  });

  it('rejects with a wrapped error when a resource fails to load', async () => {
    outcome = 'error';
    await expect(StyleLoaderService.loadStyles('https://cdn.test')).rejects.toThrow(
      'Error loading styles'
    );
  });
});
