import { useRouter } from 'next/router';
import Script from 'next/script';
import type { FC, ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { When } from 'react-if';
import { shallow } from 'zustand/shallow';

import useLoadedInIframeStore from 'hooks/useLoadedInIframeStore';
import type { AuthContextValue, AuthUser } from './types';
import { useCheckUser } from 'src/data/repositories/UserRepositoryImpl';
import {
  clearAuthStorage,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredUser,
  setStoredAccessToken,
  setStoredRefreshToken,
  setStoredUser,
} from './authStorage';
import { clearAccessToken, getAccessToken, setAccessToken } from './tokenStore';

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  isAutoLogin: false,
  isAutoLogout: false,
  isLoading: true,
  refreshAuth: async () => undefined,
});

const isBrowser = typeof window !== 'undefined';

const normalizeUser = (data: unknown): AuthUser | null => {
  if (typeof data !== 'object' || data === null) return null;
  const partial = data as Partial<AuthUser>;
  if (!partial.name && !partial.email) return null;
  return {
    name: partial.name || 'Pengguna',
    email: partial.email || '',
    role: partial.role === 'admin' ? 'admin' : 'user',
  };
};

// Hapus kode sekali pakai / pesan error dari URL setelah diproses, supaya tidak
// bocor ke referer atau tertukar dengan login berikutnya.
const stripAuthParams = (): void => {
  if (!isBrowser) return;
  const params = new URLSearchParams(window.location.search);
  const kept = Array.from(params.keys()).filter(
    (key) => key !== 'code' && key !== 'error'
  );
  const query =
    kept.length > 0
      ? `?${kept.map((key) => `${key}=${params.get(key)}`).join('&')}`
      : '';
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname + query
  );
};

const isAccessTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as {
      exp?: number;
    };
    if (typeof payload.exp !== 'number') return true;
    return payload.exp * 1000 <= Date.now() + 30_000;
  } catch {
    return true;
  }
};

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccessToken, setHasAccessToken] = useState(() =>
    Boolean(getAccessToken())
  );

  const [isAutoLogin] = useState(false);
  const [isAutoLogout, setIsAutoLogout] = useState(false);

  const router = useRouter();

  const [loadedInIframe] = useLoadedInIframeStore(
    (s) => [s.loadedInIframe],
    shallow
  );

  const { data: checkUserData, error: checkUserError } =
    useCheckUser(hasAccessToken);

  const applyTokenState = useCallback(() => {
    const hasToken = Boolean(getAccessToken());
    setHasAccessToken(hasToken);
    setIsAuthenticated(hasToken);
  }, []);

  // Bootstrap sesi setiap app dimuat:
  // 1) Bila URL membawa ?code (baru kembali dari CAS), tukar kode sekali pakai
  //    ke /auth/cas/token lalu simpan refresh token (terenkripsi) dan user.
  //    Code dinikmati langsung dan tidak pernah muncul di referer/URL.
  // 2) Tanpa code, gunakan refresh token yang tersimpan (terenkripsi) untuk
  //    minta access token baru. Tidak ada cookie cross-site yang diandalkan.
  useEffect(() => {
    if (!isBrowser) return;

    const finish = () => setIsLoading(false);

    (async () => {
      try {
        if (getAccessToken()) {
          finish();
          return;
        }

        if (sessionStorage.getItem('just_logged_out')) {
          sessionStorage.removeItem('just_logged_out');
          finish();
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const code =
          (window as unknown as { __authCode?: string }).__authCode ||
          params.get('code');
        const hasEligibleParam = Boolean(code || params.get('error'));
        if (hasEligibleParam) stripAuthParams();
        const authWindow = window as unknown as { __authCode?: string };
        delete authWindow.__authCode;

        if (code) {
          const res = await fetch(
            `/api/auth/cas/token?code=${encodeURIComponent(code)}`,
            { credentials: 'include' }
          );
          const data = (await res.json().catch(() => null)) as {
            accessToken?: string;
            refreshToken?: string;
            user?: unknown;
          } | null;
          if (!res.ok || !data?.accessToken) return;

          setAccessToken(data.accessToken);
          await setStoredAccessToken(data.accessToken);
          applyTokenState();
          if (data.refreshToken) {
            await setStoredRefreshToken(data.refreshToken);
          }
          const nextUser = normalizeUser(data.user);
          if (nextUser) {
            setUser(nextUser);
            await setStoredUser(nextUser);
          }
          window.dispatchEvent(new Event('auth-change'));
          return;
        }

        // Pulihkan access token dari penyimpanan (terenkripsi). Kalau masih
        // belum kedaluwarsa, langsung dipakai tanpa round-trip refresh.
        const storedAccessToken = await getStoredAccessToken();
        if (storedAccessToken && !isAccessTokenExpired(storedAccessToken)) {
          setAccessToken(storedAccessToken);
          applyTokenState();
          const storedUser = await getStoredUser();
          if (storedUser) setUser(storedUser);
          finish();
          return;
        }

        const refreshToken = await getStoredRefreshToken();
        if (!refreshToken) return;

        const res = await fetch('/api/auth/cas/token', {
          credentials: 'include',
          headers: { 'x-refresh-token': refreshToken },
        });
        const data = (await res.json().catch(() => null)) as {
          accessToken?: string;
          user?: unknown;
        } | null;
        if (!res.ok || !data?.accessToken) {
          clearAuthStorage();
          return;
        }

        setAccessToken(data.accessToken);
        await setStoredAccessToken(data.accessToken);
        applyTokenState();
        const nextUser = normalizeUser(data.user);
        if (nextUser) {
          setUser(nextUser);
          await setStoredUser(nextUser);
        }
        window.dispatchEvent(new Event('auth-change'));
      } catch {
        // Tidak ada sesi valid: biarkan user kembali ke halaman login.
      } finally {
        finish();
      }
    })();
  }, [applyTokenState]);

  useEffect(() => {
    if (checkUserData) {
      const nextUser: AuthUser = {
        name: checkUserData.name || 'Pengguna',
        email: checkUserData.email || '',
        role: checkUserData.role === 'admin' ? 'admin' : 'user',
      };
      setUser(nextUser);
      setIsAuthenticated(true);
      void setStoredUser(nextUser);
    }
  }, [checkUserData]);

  const forceLogout = useCallback(() => {
    setHasAccessToken(false);
    setIsAuthenticated(false);
    setIsAutoLogout(true);
    setUser(null);
    clearAccessToken();
    clearAuthStorage();
    router.replace('/login');
  }, [router]);

  useEffect(() => {
    const status =
      (checkUserError as any)?.status ??
      (checkUserError as any)?.response?.status;
    if (status === 401 || status === 403) forceLogout();
  }, [checkUserError, forceLogout]);

  useEffect(() => {
    const handleAutoLogout = () => forceLogout();

    window.addEventListener('auth-auto-logout', handleAutoLogout);
    return () =>
      window.removeEventListener('auth-auto-logout', handleAutoLogout);
  }, [forceLogout]);

  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    applyTokenState();
    const storedUser = await getStoredUser();
    setUser(storedUser);
    setIsLoading(false);
  }, [applyTokenState]);

  useEffect(() => {
    window.addEventListener('auth-change', refreshAuth);

    return () => {
      window.removeEventListener('auth-change', refreshAuth);
    };
  }, [refreshAuth]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAutoLogin,
        isAutoLogout,
        isLoading,
        refreshAuth,
      }}
    >
      <When condition={isAuthenticated && loadedInIframe === false}>
        <Script id="talk-to-us" />
      </When>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
