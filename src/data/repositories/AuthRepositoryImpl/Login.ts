import * as AuthDataSource from '../../sources/AuthDataSource';
import http from 'service/http';
import { getAccessToken } from './getAccessToken';

export const useLogin = () => {
  const loginBySSO = () => {
    AuthDataSource.loginBySSO();
  };

  const loginByEmail = async (email: string, password: string) => {
    const response = await AuthDataSource.loginByEmail({ email, password });

    const token = getAccessToken(response);
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
