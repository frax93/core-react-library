/**
 * Generic authentication payload. Consumers parameterize `TUser` with their own
 * user shape; the library stays agnostic of any specific backend schema.
 */
export interface AuthData<TUser = unknown> {
  token?: string;
  user?: TUser;
}
