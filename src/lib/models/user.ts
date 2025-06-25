interface Profile {
  className: string;
  descrizione: string;
  key: number;
  note: string;
  profiloPerAbilitazioneList: string;
  timestampInserimento: string;
  timestampUltimoAggiornamento: string;
  utenteInserimento: string;
  utentePerProfiloList: string;
  utenteUltimoAggiornamento: string;
}

interface User {
  className?: string;
  codiceFiscale: string;
  cognome: string;
  email: string;
  flagUtenteAttivo: string;
  key: number;
  nome: string;
  note: string;
  numeroTelefono: string;
  password: string;
  timestampInserimento: string;
  timestampUltimoAggiornamento: string;
  ufficio: string;
  ultimoLogin: string;
  username: string;
  utenteInserimento: string;
  utentePerProfiloList: string;
  utenteUltimoAggiornamento: string;
}

interface UserProfile {
  abilitazioni: string[];
  className: string;
  profilo: Profile;
  sessionId: string;
  token: string;
  utente: User;
}

export interface AuthData {
  token?: string;
  user?: UserProfile;
}