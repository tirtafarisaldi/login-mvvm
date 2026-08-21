import * as React from 'react';
import * as AuthRepositoryImpl from '../../../data/repositories/AuthRepositoryImpl';

export interface RegisterViewModelInput {
  onSuccess: (name: string, email: string, password: string) => void;
  onFailure: (message: string) => void;
}

interface RegisterViewModel {
  registerByEmailCallback: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  loading: boolean;
}

export const useRegisterViewModel = (
  input: RegisterViewModelInput
): RegisterViewModel => {
  const { registerByEmail } = AuthRepositoryImpl.useRegister();
  const [loading, setLoading] = React.useState(false);

  const registerByEmailCallback = React.useCallback(
    async (
      name: string,
      email: string,
      password: string,
      confirmPassword: string
    ): Promise<void> => {
      setLoading(true);
      try {
        await registerByEmail(name, email, password, confirmPassword);
        input.onSuccess(name, email, password);
      } catch (error: unknown) {
        const fallbackMessage = 'Registrasi gagal. Silakan coba lagi.';
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
    [input, registerByEmail]
  );

  return {
    registerByEmailCallback,
    loading,
  };
};
