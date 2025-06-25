import { createContext } from 'react';
import { AuthData } from '../../models/user';

export const initialContext = {};

export const AuthenticationContext = createContext({
  userProfile: initialContext,
  setUserProfile: (a?: AuthData): AuthData => ({ ...initialContext, ...a }),
  openLoginModal: (open: boolean) => open,
});

export const ProviderAuthentication = AuthenticationContext.Provider;
