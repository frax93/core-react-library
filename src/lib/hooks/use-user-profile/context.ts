import { createContext } from 'react';
import { AuthData } from '../../models/user';
import { UserProfileContext } from './types';

export const initialContext: AuthData = {};

export const AuthenticationContext = createContext<UserProfileContext>({
  userProfile: initialContext,
  setUserProfile: (a?: AuthData): AuthData => ({ ...initialContext, ...a }),
  openLoginModal: (open: boolean) => open,
});

export const ProviderAuthentication = AuthenticationContext.Provider;
