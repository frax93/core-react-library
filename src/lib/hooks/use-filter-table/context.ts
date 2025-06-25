import { createContext } from 'react';

export interface FilterTable<T = undefined> {
  values?: T;
  setValues: (values?: T) => void;
}

const FilterTableContext = createContext<FilterTable<unknown>>({
  setValues: () => {
    return;
  },
});

export default FilterTableContext;
