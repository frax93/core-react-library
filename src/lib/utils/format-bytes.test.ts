import { describe, it, expect } from 'vitest';
import { formatBytes } from './format-bytes';

describe('formatBytes', () => {
  it('returns "0 Bytes" for zero, falsy or negative input', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(-100)).toBe('0 Bytes');
    expect(formatBytes(Number.NaN)).toBe('0 Bytes');
  });

  it('formats bytes into the correct unit', () => {
    expect(formatBytes(500)).toBe('500 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('honours the decimals argument', () => {
    expect(formatBytes(1536, 0)).toBe('2 KB');
    expect(formatBytes(1536, 2)).toBe('1.5 KB');
  });
});
