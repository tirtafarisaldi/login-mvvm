import * as AuthDataSource from '../../sources/AuthDataSource';
import http from 'service/http';
import { getAccessToken } from './getAccessToken';
import { setStoredAccessToken } from 'service/authStorage';
import { setAccessToken } from 'service/tokenStore';

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
      setAccessToken(token);
      void setStoredAccessToken(token);
      http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      window.dispatchEvent(new Event('auth-change'));
    }

    return response;
  };

  return {
    registerByEmail,
  };
};
