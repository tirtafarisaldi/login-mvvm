import * as AuthDataSource from '../../sources/AuthDataSource';
import http from 'service/http';
import { getAccessToken } from './getAccessToken';

export const useRegister = () => {
  const registerByEmail = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const response = await AuthDataSource.registerByEmail({
      name,
      email,
      password,
      confirmPassword,
    });

    const token = getAccessToken(response);
    if (token) {
      try {
        localStorage.setItem('accessToken', token);
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        window.dispatchEvent(new Event('auth-change'));
      } catch (e) {
        // ignore storage errors
      }
    }

    return response;
  };

  return {
    registerByEmail,
  };
};
