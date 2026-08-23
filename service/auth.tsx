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
// import {
//   browserName,
//   browserVersion,
//   osName,
//   osVersion,
// } from 'react-device-detect';
import { When } from 'react-if';
import { shallow } from 'zustand/shallow';

import useLoadedInIframeStore from 'hooks/useLoadedInIframeStore';
import type { AuthContextValue } from './types';
import { useCheckUser } from 'src/data/repositories/UserRepositoryImpl';

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  isAutoLogin: false,
  isAutoLogout: false,
  isLoading: true,
  refreshAuth: async () => undefined,
});

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isAutoLogin] = useState(false);
  const [isAutoLogout, setIsAutoLogout] = useState(false);

  const router = useRouter();

  const [loadedInIframe] = useLoadedInIframeStore(
    (s) => [s.loadedInIframe],
    shallow
  );
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const { error } = useCheckUser(hasAccessToken);

  const handleAuth = useCallback(async () => {
    setIsLoading(true);

    const authState = {
      isAuthenticated: false,
      isAutoLogout: false,
      user: null,
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      setHasAccessToken(Boolean(accessToken));
      if (accessToken) {
        authState.isAuthenticated = true;
      }

      if (error?.data?.error?.message === 'Unauthorized') {
        authState.isAutoLogout = true;
        localStorage.removeItem('accessToken');
        setHasAccessToken(false);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error validating auth: ', err);
      localStorage.removeItem('accessToken');
      setHasAccessToken(false);
    }

    setIsAuthenticated(authState.isAuthenticated);
    setIsAutoLogout(authState.isAutoLogout);
    setUser(authState.user);

    setIsLoading(false);
  }, [error]);

  useEffect(() => {
    handleAuth();
  }, [handleAuth]);

  useEffect(() => {
    const handleAutoLogout = () => {
      setIsAuthenticated(false);
      setIsAutoLogout(true);
      setUser(null);
      setHasAccessToken(false);
      router.replace('/login');
    };

    window.addEventListener('auth-auto-logout', handleAutoLogout);
    return () =>
      window.removeEventListener('auth-auto-logout', handleAutoLogout);
  }, [router]);

  useEffect(() => {
    const refreshAuth = () => {
      handleAuth();
    };

    window.addEventListener('auth-change', refreshAuth);
    window.addEventListener('storage', refreshAuth);

    return () => {
      window.removeEventListener('auth-change', refreshAuth);
      window.removeEventListener('storage', refreshAuth);
    };
  }, [handleAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && router.pathname === '/login') {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAutoLogin,
        isAutoLogout,
        isLoading,
        refreshAuth: handleAuth,
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
