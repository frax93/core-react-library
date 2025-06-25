import React from 'react';

/**
 * The hook to debounce values
 * @param {*} value the value
 * @param {number} delay the delay
 * @returns {*} the debounced value
 */
export const useDebounce = <T>(value: T, delay = 500): unknown => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, setDebouncedValue, delay]);

  return debouncedValue;
};
