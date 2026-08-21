import * as React from 'react';
import * as AuthRepositoryImpl from '../../../data/repositories/AuthRepositoryImpl';

export interface LoginViewModelInput {
  onSuccess: (email: string, password: string) => void;
  onFailure: (message: string) => void;
}

interface LoginViewModel {
  loginBySSOCallback: () => void;
  loginByEmailCallback: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

export const useLoginViewModel = (
  input: LoginViewModelInput
): LoginViewModel => {
  const { loginBySSO, loginByEmail } = AuthRepositoryImpl.useLogin();
  const [loading, setLoading] = React.useState(false);

  const loginBySSOCallback = React.useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      loginBySSO();
    } finally {
      setLoading(false);
    }
  }, [loginBySSO]);

  const loginByEmailCallback = React.useCallback(
    async (email: string, password: string): Promise<void> => {
      setLoading(true);
      try {
        const res = await loginByEmail(email, password);
        input.onSuccess(email, password);
        return res as unknown as void;
      } catch (error: unknown) {
        const fallbackMessage = 'Login gagal. Cek kembali email atau password.';
        const errorMessage = (() => {
          if (typeof error !== 'object' || error === null)
            return fallbackMessage;
          if (
            'data' in error &&
            typeof error.data === 'object' &&
            error.data !== null
          ) {
            const data = error.data as { message?: unknown };
            if (typeof data.message === 'string') return data.message;
          }
          if ('message' in error && typeof error.message === 'string')
            return error.message;
          return fallbackMessage;
        })();
        input.onFailure(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [input, loginByEmail]
  );

  return {
    loginBySSOCallback,
    loginByEmailCallback,
    loading,
  };
};
