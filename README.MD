# Core React Library

Libreria React per gestire chiamate HTTP con hook personalizzati basati su Axios.

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

## Contribuire

Sono benvenuti suggerimenti, issue e pull request per migliorare la libreria!

---

## Licenza

MIT License
