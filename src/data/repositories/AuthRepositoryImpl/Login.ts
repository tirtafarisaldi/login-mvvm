import * as AuthDataSource from '../../sources/AuthDataSource';
import http from 'service/http';
import { getAccessToken } from './getAccessToken';
import type { AuthUser } from 'service/types';

export const useLogin = () => {
  const loginBySSO = () => {
    AuthDataSource.loginBySSO();
  };

  const loginByEmail = async (email: string, password: string) => {
    const response = await AuthDataSource.loginByEmail({ email, password });

    const token = getAccessToken(response);

    const userData = (response as { user?: Partial<AuthUser> })?.user;
    if (userData && (userData.name || userData.email)) {
      try {
        localStorage.setItem(
          'authUser',
          JSON.stringify({
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role === 'admin' ? 'admin' : 'member',
          })
        );
      } catch (e) {
        // ignore storage errors
      }
    }

    if (token) {
      try {
        localStorage.setItem('accessToken', token);
        // set default header for subsequent requests
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        window.dispatchEvent(new Event('auth-change'));
      } catch (e) {
        // ignore storage errors
      }
    }

    return response;
  };

  return {
    loginBySSO,
    loginByEmail,
  };
};
