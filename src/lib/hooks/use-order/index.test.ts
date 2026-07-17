import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOrder } from './index';
import { OrderTypes } from '../../view-models/order';
import { HeadCell } from '../../view-models/head-cell';

type Row = { name: string; age: number };
const nameCell: HeadCell<Row, 'name'> = { id: 'name', label: 'Name' };
const ageCell: HeadCell<Row, 'age'> = { id: 'age', label: 'Age' };

describe('useOrder', () => {
  it('reports the order direction for a matching column', () => {
    const { result } = renderHook(() => useOrder<Row, keyof Row>({ name: OrderTypes.Asc }));

    expect(result.current(nameCell)).toEqual({ exist: true, value: OrderTypes.Asc });
  });

  it('reports no order for a column without one', () => {
    const { result } = renderHook(() => useOrder<Row, keyof Row>({ name: OrderTypes.Asc }));

    expect(result.current(ageCell)).toEqual({ exist: false, value: undefined });
  });
});
