import { AuthData } from '../../models/user';

/**
 * Internal state persisted by the AuthenticationProvider: the auth data plus
 * some UI flags.
 */
export interface UserProfile<TUser = unknown> extends AuthData<TUser> {
  isLoading?: boolean;
  stateLoginModal?: boolean;
}

export interface UserProfileContext<TUser = unknown> {
  userProfile: AuthData<TUser>;
  setUserProfile: (a?: AuthData<TUser>) => AuthData<TUser>;
  openLoginModal?: (open: boolean) => void;
}

export enum SessionManagementEnum {
  Storage = 'storage',
  State = 'state',
}
