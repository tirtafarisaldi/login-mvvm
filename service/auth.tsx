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

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  isAutoLogin: false,
  isAutoLogout: false,
  isLoading: true,
  refreshAuth: async () => undefined,
});

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('accessToken');
  } catch {
    return null;
  }
};

const getStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem('authUser');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed.name || !parsed.email) return null;
    return {
      name: parsed.name,
      email: parsed.email,
      role: parsed.role === 'admin' ? 'admin' : 'user',
    };
  } catch {
    return null;
  }
};

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isAutoLogin] = useState(false);
  const [isAutoLogout, setIsAutoLogout] = useState(false);

  const router = useRouter();

  const [loadedInIframe] = useLoadedInIframeStore(
    (s) => [s.loadedInIframe],
    shallow
  );
  const [hasAccessToken, setHasAccessToken] = useState(() =>
    Boolean(getStoredToken())
  );
  const { data: checkUserData, error: checkUserError } =
    useCheckUser(hasAccessToken);

  const applyTokenState = useCallback((token: string | null) => {
    setHasAccessToken(Boolean(token));
    setIsAuthenticated(Boolean(token));
    if (token) {
      const stored = getStoredUser();
      if (stored) setUser(stored);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Simpan loading sampai bootstrap sesi selesai (agar tidak flash halaman login).
    if (getStoredToken()) {
      applyTokenState(getStoredToken());
      setIsLoading(false);
    }
  }, [applyTokenState]);

  // Bootstrap sesi: setiap app dimuat, bila belum ada access token di localStorage,
  // minta /auth/cas/token (backed oleh cookie refresh httpOnly) untuk mendapat
  // access token + user. Access token tidak pernah lewat URL.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finish = () => setIsLoading(false);

    if (getStoredToken()) {
      finish();
      return;
    }

    // Jika user baru saja logout, jangan ambil token dari CAS cookie.
    if (sessionStorage.getItem('just_logged_out')) {
      sessionStorage.removeItem('just_logged_out');
      finish();
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      window.history.replaceState({}, document.title, window.location.pathname);
      finish();
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/auth/cas/token', {
          credentials: 'include',
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.accessToken) return;

        localStorage.setItem('accessToken', data.accessToken);
        if (data.user && (data.user.name || data.user.email)) {
          localStorage.setItem(
            'authUser',
            JSON.stringify({
              name: data.user.name || 'Pengguna',
              email: data.user.email || '',
              role: data.user.role === 'admin' ? 'admin' : 'user',
            })
          );
        }
        window.dispatchEvent(new Event('auth-change'));
      } catch (e) {
        // Tidak ada sesi valid: biarkan user kembali ke halaman login.
      } finally {
        finish();
      }
    })();
  }, []);

  useEffect(() => {
    if (checkUserData) {
      const nextUser: AuthUser = {
        name: checkUserData.name || 'Pengguna',
        email: checkUserData.email || '',
        role: checkUserData.role === 'admin' ? 'admin' : 'user',
      };
      setUser(nextUser);
      setIsAuthenticated(true);
      try {
        localStorage.setItem('authUser', JSON.stringify(nextUser));
      } catch {
        // ignore storage errors
      }
    }
  }, [checkUserData]);

  const forceLogout = useCallback(() => {
    setIsAuthenticated(false);
    setIsAutoLogout(true);
    setUser(null);
    setHasAccessToken(false);
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
    } catch {
      // ignore storage errors
    }
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
    applyTokenState(getStoredToken());
    setIsLoading(false);
  }, [applyTokenState]);

  useEffect(() => {
    window.addEventListener('auth-change', refreshAuth);
    window.addEventListener('storage', refreshAuth);

    return () => {
      window.removeEventListener('auth-change', refreshAuth);
      window.removeEventListener('storage', refreshAuth);
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
