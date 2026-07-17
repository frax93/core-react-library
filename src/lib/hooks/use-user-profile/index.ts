import { useContext } from 'react';
import { AuthenticationContext } from './context';
import { UserProfileContext } from './types';

/**
 * A custom hook to quickly read the authentication context's value. Parameterize
 * `TUser` with your own user shape.
 * @returns {object} the user context
 */
export const useUserProfile = <TUser = unknown>(): UserProfileContext<TUser> => {
  const { userProfile, setUserProfile } = useContext(AuthenticationContext);

  return { userProfile, setUserProfile } as UserProfileContext<TUser>;
};
