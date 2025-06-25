import React, {ReactElement } from 'react';
import useLocalStorage from '../use-local-storage';
import { initialContext, ProviderAuthentication } from './context';
import { UserProfile } from './types';
import { AuthData } from '../../models/user';

interface Properties {
  children: ReactElement;
}


const storageKey = 'auth';
const useProfileStore = (ctx: UserProfile) => useLocalStorage(storageKey, ctx);

/**
 * Component Authentication loader
 * @param {*} props the root object
 * @returns {React.ReactComponentElement} the react component
 */
export const AuthenticationProvider = ({ children }: Properties): ReactElement => {
  const [userProfile, setUserProfile] = useProfileStore(initialContext);

  /**
   * open login modal
   * @param {*} open the root object
   */
  const openLoginModal = React.useCallback(
    (open: boolean) => {
      setUserProfile({ ...userProfile, stateLoginModal: open, isLoading: false });
      return true;
    },
    [setUserProfile, userProfile]
  );

  /**
   * set datilogin
   * @param {object} datiLogin the root object
   */
  const setDatiLogin = React.useCallback(
    (datiLogin: AuthData | undefined): AuthData => {
      const returnObject = { ...userProfile, ...datiLogin, };
      setUserProfile(returnObject);
      return returnObject;
    },
    [setUserProfile, userProfile]
  );

  return (
    <ProviderAuthentication
      value={{
        userProfile: userProfile || {},
        setUserProfile: setDatiLogin,
        openLoginModal,
      }}
    >
      {children}
    </ProviderAuthentication>
  );
};

AuthenticationProvider.displayName = 'Authentication Provider componet';
