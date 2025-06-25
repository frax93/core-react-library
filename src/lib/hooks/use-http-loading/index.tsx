import React, { useCallback } from 'react';
import { memo } from 'react';
import { useMemo } from 'react';
import { useContext } from 'react';
import { createContext, ReactElement, useState } from 'react';

interface HttpLoadingContextShape {
  addLoading: () => void;
  removeLoading: () => void;
  isLoading: boolean;
}

export const HttpLoadingContext = createContext<HttpLoadingContextShape | null>(null);

interface HttpLoadingProviderProps {
  children: ReactElement;
}

export const HttpLoadingProvider = memo(({ children }: HttpLoadingProviderProps): ReactElement => {
  const [loadingCount, setLoadingCount] = useState(0);

  /**
   * Increase the loading count.
   */
  const addLoading = useCallback(
    () => setLoadingCount((prevValue) => prevValue + 1),
    [setLoadingCount]
  );

  /**
   * Decreases the loading count.
   */
  const removeLoading = useCallback(
    () => setLoadingCount((prevValue) => (prevValue > 0 ? prevValue - 1 : 0)),
    [setLoadingCount]
  );

  /**
   * A flag telling whether there is a loading in progress or not.
   */
  const isLoading = useMemo(() => loadingCount > 0, [loadingCount]);

  return (
    <HttpLoadingContext.Provider value={{ addLoading, removeLoading, isLoading }}>
      {children}
    </HttpLoadingContext.Provider>
  );
});

HttpLoadingProvider.displayName = 'HttpLoadingProvider';

export const useHttpLoading = (): HttpLoadingContextShape => {
  const ctx = useContext(HttpLoadingContext);
  if (!ctx) {
    throw new Error('No provider defined for http loading context');
  }

  return ctx;
};
