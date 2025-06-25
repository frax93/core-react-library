import React, { memo, useLayoutEffect, useRef, useState } from 'react';
import { loadRemoteModule, remoteModuleMap } from './remote-loader';
import { createWebComponentWrapper } from './web-component-wrapper';
import { createErrorComponent } from './error-component';

type DynamicLoaderComponentProps<T> = {
  remoteName: string;
  remoteEntry: string;
  exposedModule: string;
  id: string;
  inputsAndHandlers?: { [K in keyof T]: T[K] };
  children?: React.ReactNode;
  keepAlive?: boolean;
};

const DynamicLoaderComponent = <T extends Record<string, unknown>>({
  remoteName,
  remoteEntry,
  exposedModule,
  inputsAndHandlers,
  children,
  id,
}: DynamicLoaderComponentProps<T>) => {
  const [RemoteComponent, setRemoteComponent] = useState<React.ElementType | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let isMounted = true;
    const remoteModuleKey = `${remoteName}:./${exposedModule}`;
    const existingModule = remoteModuleMap.get(remoteModuleKey) as Record<string, unknown> | undefined;

    if (existingModule) {
      const RemoteModule = existingModule[`${exposedModule}Module`];
      const init = existingModule[`init${exposedModule}WebComponent`] as (id: string) => Promise<void>;

      if (typeof RemoteModule === 'function') {
        const elementName = id;
        init(id).then(() => {
          if (!isMounted) return;
          setRemoteComponent(() => createWebComponentWrapper(elementName, inputsAndHandlers));
        });
      }

      return;
    }

    loadRemoteModule(remoteName, `./${exposedModule}`)
      .then(async (m) => {
        if (!isMounted) return;

        const RemoteModule = m[`${exposedModule}Module`];
        const init = m[`init${exposedModule}WebComponent`];

        if (typeof RemoteModule === 'function') {
          ref.current = await init(id);
          const elementName = id;
          setRemoteComponent(() => createWebComponentWrapper(elementName, inputsAndHandlers));
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        setRemoteComponent(() => createErrorComponent(id));
      });

    return () => {
      isMounted = false;
    };
  }, [remoteName, remoteEntry, exposedModule, inputsAndHandlers, id]);

  return RemoteComponent ? (
    <RemoteComponent {...inputsAndHandlers}>{children}</RemoteComponent>
  ) : null;
};

DynamicLoaderComponent.displayName = 'DynamicLoaderComponent';

export const DynamicLoader = memo(DynamicLoaderComponent);
export default DynamicLoader;
