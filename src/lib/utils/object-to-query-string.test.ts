import { describe, it, expect } from 'vitest';
import { objectToQueryString } from './object-to-query-string';

describe('objectToQueryString', () => {
  it('returns an empty string for an empty object', () => {
    expect(objectToQueryString('filter', {})).toBe('');
  });

  it('serializes a single property', () => {
    expect(objectToQueryString('filter', { name: 'john' })).toBe('filter=name:john');
  });

  it('joins multiple properties with the key prefix', () => {
    expect(objectToQueryString('filter', { name: 'john', age: 30 })).toBe(
      'filter=name:john&filter=age:30'
    );
  });

  it('skips falsy values', () => {
    expect(objectToQueryString('filter', { name: 'john', city: '' })).toBe('filter=name:john');
  });
});
