# Core React Library

[![npm version](https://img.shields.io/npm/v/@frank.md93/core-react-library.svg)](https://www.npmjs.com/package/@frank.md93/core-react-library)
[![license](https://img.shields.io/npm/l/@frank.md93/core-react-library.svg)](./LICENSE)
[![types](https://img.shields.io/npm/types/@frank.md93/core-react-library.svg)](https://www.typescriptlang.org/)

A small, dependency-light toolbox for React applications: typed HTTP hooks built on
Axios, a dynamic loader for federated remote modules (Module Federation / Web Components),
and a set of general-purpose hooks and utilities.

Written in TypeScript and shipped with both ESM and CommonJS builds plus type
declarations.

---

## Requirements

- **React** `>=17` (works with React 17, 18 and 19)
- **Node.js** `>=18` (only needed to build the library, not to consume it)

---

## Installation

```bash
npm install @frank.md93/core-react-library
# or
yarn add @frank.md93/core-react-library
# or
pnpm add @frank.md93/core-react-library
```

Install the peer dependencies you actually use. `react` and `react-dom` are always
required; the others are only needed by specific features:

```bash
npm install react react-dom axios mitt @juggle/resize-observer
```

| Peer dependency          | Required by                                   |
| ------------------------ | --------------------------------------------- |
| `react`, `react-dom`     | everything                                    |
| `axios`                  | `useHttpClient`, `useHttpFetch`, HTTP provider |
| `mitt`                   | `useBus` / `useListener`                      |
| `@juggle/resize-observer`| `useElementScrollWidthObserver`               |

---

## API overview

### HTTP hooks

| Export                    | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| `HttpProvider`            | Provides a configured Axios instance to the hooks below.                 |
| `useHttpClient`           | Stateless request function for a given URL (you manage state yourself).  |
| `useHttpFetch`            | Stateful REST hook exposing `{ data, isLoading, hasError, error }`.      |
| `useHttpProviderContext`  | Access the underlying Axios instance from the provider.                  |
| `useHttpLoading`          | Global HTTP loading flag (with `HttpLoadingProvider`).                   |

### Components

| Export          | Description                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| `DynamicLoader` | Loads a federated remote module and mounts it as a React Web Component.         |

### General-purpose hooks

| Export                          | Description                                                     |
| ------------------------------- | -------------------------------------------------------------- |
| `useDebounce`                   | Debounce a changing value.                                     |
| `useClickOutside`               | Detect clicks/taps outside a referenced element.               |
| `useDoubleClick`                | Distinguish single from double clicks.                         |
| `useLocalStorage`               | Reactive `localStorage` binding with custom (de)serializers.   |
| `useElementScrollWidthObserver` | Track whether an element is horizontally scrollable.           |
| `useBus` / `useListener`        | Lightweight pub/sub event bus (backed by `mitt`).              |
| `useErrorHandler`               | Centralized error handling context.                            |
| `useFilterTable` / `useOrder`   | Helpers for filterable / sortable tables.                      |
| `useUserProfile`                | User profile context.                                          |
| `useGraphql`                    | Minimal GraphQL query helper.                                  |
| `usePromises`                   | Utilities for working with collections of promises.           |

### Utilities

`debounce`, `delay`, `noop`, `formatBytes`, `generatePromise`, `objectToQueryString`,
`listObjectToQueryString`, `operationObjectToQueryString`, `StyleLoaderService`.

> A full list of exports is available in the generated type declarations (`index.d.ts`).

---

## Usage

### HTTP: provider + hooks

The HTTP hooks read a configured Axios instance from `HttpProvider`. Wrap your app
(or the relevant subtree) once:

`HttpProvider` builds and shares an Axios instance from a `baseUrl` and optional
request/response interceptors:

```tsx
import { HttpProvider } from '@frank.md93/core-react-library';

export function App() {
  return (
    <HttpProvider
      baseUrl="https://api.example.com"
      requestInterceptors={{}}
      responseInterceptors={{}}
    >
      <Routes />
    </HttpProvider>
  );
}
```

#### `useHttpFetch` (stateful)

The hook state exposes `isLoading`, `hasErrors`, `error` and `data`. By default
`data` holds the raw Axios response; pass a `transformer` to unwrap the body into
the shape you want.

```tsx
import type { AxiosResponse } from 'axios';
import { useHttpFetch } from '@frank.md93/core-react-library';

type Item = { id: number; name: string };

function ItemList() {
  const [state, refetch] = useHttpFetch<Item[], Item[]>('/items', {
    onBootstrap: true, // fetch on mount
    transformer: (res: AxiosResponse<Item[]>) => res.data,
    options: { method: 'GET' },
  });

  if (state.isLoading) return <p>Loading…</p>;
  if (state.hasErrors) return <p>Error: {state.error?.message}</p>;

  return (
    <ul>
      {(state.data as Item[] | undefined)?.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
      <button onClick={() => refetch()}>Reload</button>
    </ul>
  );
}
```

#### `useHttpClient` (stateless)

Returns a request function; you own the loading/error state.

```tsx
import { useEffect, useState } from 'react';
import { useHttpClient } from '@frank.md93/core-react-library';

type Item = { id: number; name: string };

function ItemList() {
  const getItems = useHttpClient<Item[]>('/items');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getItems()
      .then((response) => setItems(response.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [getItems]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### `DynamicLoader` — remote module loader

Loads a module exposed through Webpack Module Federation and mounts it as a React
Web Component.

```tsx
import { DynamicLoader } from '@frank.md93/core-react-library';

function App() {
  return (
    <DynamicLoader
      remoteName="remoteApp"
      remoteEntry="https://remote-app.com/remoteEntry.js"
      exposedModule="MyComponent"
      id="my-remote-web-component"
      inputsAndHandlers={{
        title: 'Hello from the host',
        onClick: () => alert('Clicked!'),
      }}
    />
  );
}
```

| Prop                | Type                  | Description                                                        |
| ------------------- | --------------------- | ----------------------------------------------------------------- |
| `remoteName`        | `string`              | Name of the federated remote container.                           |
| `remoteEntry`       | `string`              | URL of the federated entry (`remoteEntry.js`).                    |
| `exposedModule`     | `string`              | Name of the exposed module, e.g. `MyComponent`.                   |
| `id`                | `string`              | Unique id of the web component (also the custom element tag name).|
| `inputsAndHandlers` | `Record<string, unknown>` | Props and event handlers passed to the web component.         |
| `children`          | `React.ReactNode`     | Optional React children.                                          |
| `keepAlive`         | `boolean`             | Optional. Keeps the component mounted when its key changes.        |

> The remote module must expose the `init<Module>WebComponent` and `<Module>Module`
> entries so it can be initialized correctly.

### Other hooks

```tsx
import { useDebounce, useLocalStorage } from '@frank.md93/core-react-library';

function Search() {
  const [query, setQuery] = useLocalStorage('search:last', '');
  const debounced = useDebounce(query, 300);
  // …run the search whenever `debounced` changes
}
```

---

## Development

```bash
npm install       # install dependencies (Node >=18)
npm run build     # produce the dist/ bundle (ESM + CJS + types)
npm test          # run the test suite (Vitest)
npm run lint      # lint the source
```

The published package manifest (`dist/package.json`) is generated automatically at
build time from the root `package.json`, so version and metadata have a single source
of truth. The library is published from the `dist/` folder:

```bash
npm run build
cd dist && npm publish
```

`prepublishOnly` runs the build automatically, so `npm publish` always ships a fresh bundle.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before
opening an issue or a pull request.

## License

[MIT](./LICENSE) © Francesco Murador
