import React, { ReactElement, ReactNode } from 'react';
import mitt from 'mitt';

interface Properties {
  children: ReactNode;
}

type BusContext = {
  on: <T>(name: string, fn: (param?: T) => void) => void;
  off: <T>(name: string, fn: (param?: T) => void) => void;
  emit: <T>(name: string, payload?: T) => void;
};

export const BusContext = React.createContext<Partial<BusContext>>({});
const P = BusContext.Provider;

export function useBus(): BusContext {
  const bus = React.useContext(BusContext);

  if (!bus) {
    throw new Error('No event bus defined');
  }

  return bus as BusContext;
}

export function useListener<T = never>(name: string, fn: (params?: T) => void): void {
  const bus = useBus() as BusContext;
  React.useEffect(() => {
    bus.on(name, fn);
    return () => {
      bus.off(name, fn);
    };
  }, [bus, name, fn]);
}

export function Provider({ children }: Properties): ReactElement {
  const [bus] = React.useState(() => mitt());
  return <P value={bus}>{children}</P>;
}

Provider.displayName = 'Provider bus';
