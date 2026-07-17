import { describe, it, expect } from 'vitest';
import { paginationListToQueryString } from './list-object-to-query-string';
import { OrderTypes } from '../view-models/order';

describe('paginationListToQueryString', () => {
  it('serializes pagination, filters and orders together', () => {
    const query = paginationListToQueryString({
      filters: { name: { value: 'john' } },
      orders: { name: OrderTypes.Asc },
      page: 2,
      rowsPerPage: 10,
    });

    expect(query).toBe('pageOffset=20&pageSize=10&filters=name:john:LIKE&sort=name:asc');
  });

  it('omits pagination when page/rowsPerPage are missing', () => {
    const query = paginationListToQueryString({
      filters: { name: { value: 'john' } },
      orders: {},
    });

    // NOTE: with no pagination segment the filters are still prefixed with `&`
    // (current behaviour of the serializer).
    expect(query).toBe('&filters=name:john:LIKE');
  });

  it('returns an empty string when there is nothing to serialize', () => {
    expect(paginationListToQueryString({ filters: {}, orders: {} })).toBe('');
  });
});
