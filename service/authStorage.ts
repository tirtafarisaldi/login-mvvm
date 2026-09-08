import type { AuthUser } from './types';
import { secureGet, secureRemove, secureSet } from './secureStorage';

const ACCESS_TOKEN_KEY = 'authAccessToken';
const REFRESH_TOKEN_KEY = 'authRefreshToken';
const USER_KEY = 'authUser';

export const getStoredAccessToken = (): Promise<string | null> =>
  secureGet<string>(ACCESS_TOKEN_KEY);

export const setStoredAccessToken = (token: string): Promise<void> =>
  secureSet(ACCESS_TOKEN_KEY, token);

export const getStoredRefreshToken = (): Promise<string | null> =>
  secureGet<string>(REFRESH_TOKEN_KEY);

export const setStoredRefreshToken = (token: string): Promise<void> =>
  secureSet(REFRESH_TOKEN_KEY, token);

export const getStoredUser = (): Promise<AuthUser | null> =>
  secureGet<AuthUser>(USER_KEY);

export const setStoredUser = (user: AuthUser): Promise<void> =>
  secureSet(USER_KEY, user);

export const clearAuthStorage = (): void => {
  secureRemove(ACCESS_TOKEN_KEY);
  secureRemove(REFRESH_TOKEN_KEY);
  secureRemove(USER_KEY);
};