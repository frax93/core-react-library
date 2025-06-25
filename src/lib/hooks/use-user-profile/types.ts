import { AuthData } from "../../models/user";


export interface UserProfile {
  datiLogin?: AuthData;
  isLoading?: boolean;
  stateLoginModal?: boolean | undefined;
}

export interface UserProfileContext {
  userProfile: AuthData;
  setUserProfile: (a?: AuthData) => AuthData;
  openLoginModal?: (open: boolean) => void;
}

export enum SessionManagementEnum {
  Storage = 'storage',
  State = 'state',
}
