import { useCallback, useEffect, useState } from 'react';

export type ParseFn = <T>(value: string) => T;
export type SerializeFn = <T>(value: T) => string;

/**
 * Gets a parsed value from the local storage.
 */
export function getFromLocalStorage<T>(
  key: string,
  defaultValue: T,
  parseFn: ParseFn = JSON.parse
): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? parseFn(item) : defaultValue;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Stores a serialized value to the local storage.
 */
export function storeToLocalStorage<T>(
  key: string,
  value: T,
  serializeFn: SerializeFn = JSON.stringify
): void {
  window.localStorage.setItem(key, serializeFn(value));
}

/**
 * Manage access and update for a given key of the local storage.
 */
export default function useLocalStorage<T>(
  key: string,
  fallbackValue: T,
  parseFn: ParseFn = JSON.parse,
  serializeFn: SerializeFn = JSON.stringify
): [T | null, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T | null>(
    getFromLocalStorage(key, fallbackValue, parseFn)
  );

  /**
   * Updates the local state and the corresponding value in the storage.
   */
  const setValue = useCallback(
    (value: T): void => {
      setStoredValue(value);
      storeToLocalStorage(key, value, serializeFn);
    },
    [setStoredValue]
  );

  useEffect(() => {
    /**
     * Handles the "storage" event that fires when a storage area is modified in the context of another document.
     * FIXME: Currently there is no way to identify the storage sourcing the event (e.g. session vs local storage).
     */
    function storageListener(event: StorageEvent): void {
      // There is a change on an item different than the managed one.
      if (event.key !== key) {
        return;
      }

      const { newValue } = event;
      const parsedNewValue = newValue ? parseFn<T>(newValue) : null;
      setStoredValue((prevValue) => (parsedNewValue !== prevValue ? parsedNewValue : prevValue));
    }

    // Always remove any previous registered listeners since the effect can be triggered more than once.
    window.removeEventListener('storage', storageListener);
    window.addEventListener('storage', storageListener);

    return () => window.removeEventListener('storage', storageListener);
  }, [setStoredValue]);

  return [storedValue, setValue];
}
