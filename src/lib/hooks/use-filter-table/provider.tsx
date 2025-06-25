import React, { useCallback, useState, ReactElement } from 'react';
import FilterTableContext from './context';

interface FilterTableProviderProps<T> {
  initialValues: T;
  children: ReactElement;
}

const FilterTableProvider = <T,>({
  initialValues,
  children,
}: FilterTableProviderProps<T>): ReactElement => {
  const [filterTable, setFilterTable] = useState<T>(initialValues);

  const setValues = useCallback(
    (values: T) => {
      setFilterTable((oldValues) => ({ ...oldValues, ...values }));
    },
    [setFilterTable]
  );

  return (
    <FilterTableContext.Provider
      value={{
        values: filterTable,
        setValues: setValues as (values: unknown) => void,
      }}
    >
      {children}
    </FilterTableContext.Provider>
  );
};

FilterTableProvider.displayName = 'Filter Table Provider';

export default FilterTableProvider;
