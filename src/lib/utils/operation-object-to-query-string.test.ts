import { describe, it, expect } from 'vitest';
import operationObjectToQueryString from './operation-object-to-query-string';
import { Operation } from '../view-models/operation';

describe('operationObjectToQueryString', () => {
  it('returns an empty string for an empty object', () => {
    expect(operationObjectToQueryString('filters', {})).toBe('');
  });

  it('defaults the operation to LIKE', () => {
    expect(operationObjectToQueryString('filters', { name: { value: 'john' } })).toBe(
      'filters=name:john:LIKE'
    );
  });

  it('uses the provided operation', () => {
    expect(
      operationObjectToQueryString('filters', {
        name: { value: 'john', operation: Operation.EQUALS },
      })
    ).toBe('filters=name:john:EQUALS');
  });

  it('joins multiple entries with the key prefix', () => {
    expect(
      operationObjectToQueryString('filters', {
        name: { value: 'john' },
        age: { value: 30 },
      })
    ).toBe('filters=name:john:LIKE&filters=age:30:LIKE');
  });
});
