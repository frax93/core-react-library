import React, { createContext, useState, useMemo, ReactElement } from 'react';
import { HttpBackendError } from '../use-http-fetch/http-error';

interface ErrorHandlerProps {
  children: ReactElement;
}

export interface ErrorStatus {
  error?: HttpBackendError;
  setError: (error?: HttpBackendError) => void;
}

// A context will be the way that we allow components lower down
// the tree to trigger the display of an error page
export const ErrorStatusContext = createContext<ErrorStatus>({
  setError: () => {
    return;
  },
});

// The top level component that will wrap our app's core features
const ErrorHandlerComponent = ({ children }: ErrorHandlerProps): ReactElement => {
  const [errorObject, setErrorObject] = useState<HttpBackendError>();

  // We wrap it in a useMemo for performance reasons.
  const contextPayload = useMemo(
    () => ({ errorObject, setErrorObject }),
    [errorObject, setErrorObject]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return (
    <ErrorStatusContext.Provider
      value={{
        error: contextPayload.errorObject,
        setError: contextPayload.setErrorObject,
      }}
    >
      {children}
    </ErrorStatusContext.Provider>
  );
};

ErrorHandlerComponent.displayName = 'Error provider';

export const ErrorHandlerProvider = ErrorHandlerComponent;
