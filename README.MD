# Core React Library

Libreria React con varie funzioni di utilità tra cui:
- Gestire chiamate HTTP con hook personalizzati basati su Axios.

---

## Installazione

```bash
npm install core-react-library
# oppure
yarn add core-react-library
```

---

## Funzionalità principali

- `useHttpClient`: hook per chiamate HTTP generiche (GET, POST, PUT, DELETE) senza stato.
- `useHttpFetch`: hook per fetch REST con gestione di loading, error e dati.
- `useHttpProviderContext`: accesso al contesto HTTP personalizzato.
- Tipi TypeScript: `HttpFetchParameters`, `HttpRequestFunction`, `RequestOptions`.

---

## Esempi di utilizzo

### useHttpClient

```tsx
import React, { useEffect } from 'react';
import { useHttpClient } from 'core-react-library';

const MyComponent = () => {
  const get = useHttpClient();

  useEffect(() => {
    get('/api/data')
      .then(response => {
        console.log('Dati ricevuti:', response.data);
      })
      .catch(err => {
        console.error('Errore:', err);
      });
  }, [get]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>Errore: {error.message}</p>;

  return <div>Dati caricati correttamente</div>;
};

export default MyComponent;
```

---

### useHttpFetch

```tsx
import React from 'react';
import { useHttpFetch } from 'core-react-library';

const FetchList = () => {
  const [data, get] = useHttpFetch('/api/items', {
    options: {
      method: 'GET',
    },
  });

  if (data.isLoading) return <p>Caricamento...</p>;
  if (data.hasError) return <p>Errore: {data.error.message}</p>;

  return (
    <ul>
      {data.data?.map((item: any) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

export default FetchList;
```

---

## Tipi TypeScript

- `HttpFetchParameters`: Parametri per configurare le chiamate HTTP.
- `HttpRequestFunction`: Tipo funzione per richieste HTTP.
- `RequestOptions`: Opzioni configurabili per le richieste.

---

## DynamicLoader (Remote Web Component Loader)

Il componente `DynamicLoader` consente di caricare dinamicamente moduli remoti esposti tramite Webpack Module Federation e montarli come Web Component React.

### Props principali

| Prop              | Tipo                         | Descrizione |
|-------------------|------------------------------|-------------|
| `remoteName`      | `string`                     | Nome del container remoto federato |
| `remoteEntry`     | `string`                     | URL dell'entry federata (`remoteEntry.js`) |
| `exposedModule`   | `string`                     | Nome del modulo esposto, es. `MyComponent` |
| `id`              | `string`                     | ID univoco del web component (e custom element tag name) |
| `inputsAndHandlers` | `Record<string, any>`       | Oggetto con props o eventi da passare al web component |
| `children`        | `React.ReactNode`            | Eventuali figli React |
| `keepAlive`       | `boolean`                    | (Opzionale) mantiene il componente montato anche se cambia la chiave |

### Esempio di utilizzo

```tsx
import React from 'react';
import { DynamicLoader } from 'core-react-library';

const App = () => {
  return (
    <DynamicLoader
      remoteName="remoteApp"
      remoteEntry="https://remote-app.com/remoteEntry.js"
      exposedModule="MyComponent"
      id="my-remote-web-component"
      inputsAndHandlers={{
        title: 'Ciao dal container',
        onClick: () => alert('Cliccato!')
      }}
    />
  );
};
```

Assicurati che il modulo remoto esponga i metodi `initMyComponentWebComponent` e `MyComponentModule` per poter essere inizializzato correttamente.

---

* Use the `useBtcRate` hook to fetch the current Bitcoin exchange rate
* Example usage:
```typescript
import useBtcRate from './useBtcRate';

const MyComponent = () => {
  const [btcRate, fetchBtcRate] = useBtcRate();

  return (
    <div>
      <p>Current Bitcoin rate: {btcRate}</p>
      <button onClick={fetchBtcRate}>Refresh rate</button>
    </div>
  );
};
```
