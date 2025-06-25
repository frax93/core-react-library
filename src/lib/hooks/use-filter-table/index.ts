import { Context, useContext } from 'react';
import FilterTableContext, { FilterTable } from './context';

export const useFilterTable = <T>(): FilterTable<T> => {
  return useContext<FilterTable<T>>(FilterTableContext as Context<FilterTable<T>>);
};
