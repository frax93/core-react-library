import { useState, useEffect } from 'react';

const apiBtc = "https://api.binance.com/api/v3/ticker/price?symbol=BTCEUR";

const useBtcRate = (): [number, () => Promise<void>] => {
  const [btcRate, setBtcRate] = useState<number | null>(null); // Stato per memorizzare il tasso BTC/EUR
  const [, setError] = useState<string | null>(null); // Stato per gestire eventuali errori

  // Funzione per ottenere il tasso di cambio del Bitcoin
  const fetchBtcRate = async () => {
    try {
      const response = await fetch(apiBtc);
      const data = await response.json();
      setBtcRate(Number.parseFloat(Number.parseFloat(data?.price).toFixed(2)));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Errore durante il fetch del tasso BTC:", error);
      setError("Impossibile ottenere il tasso di cambio del Bitcoin");
    }
  };

  useEffect(() => {
    fetchBtcRate();
  }, []);

  return [btcRate || 0, fetchBtcRate]; // Restituisco il tasso, eventuali errori e la funzione per rifare il fetch
};

export default useBtcRate;
