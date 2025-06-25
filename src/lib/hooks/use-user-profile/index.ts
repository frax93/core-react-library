import { useContext } from 'react';
import { AuthenticationContext } from './context';
import { UserProfileContext } from './types';

/**
 * A custom hook to quickly read the context's value.
 * @returns {object} the user context
 */
export const useUserProfile = (): UserProfileContext => {
  const { userProfile, setUserProfile } = useContext(AuthenticationContext);

  return { userProfile, setUserProfile };
};
