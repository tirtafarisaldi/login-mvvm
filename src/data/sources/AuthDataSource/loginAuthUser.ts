import http from 'service/http';

export const loginBySSO = () => {
  // Redirect to your SSO endpoint if any. Adjust URL as needed.
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/sso';
  }
};

export interface LoginByEmailInput {
  email: string;
  password: string;
}

export const loginByEmail = async (input: LoginByEmailInput) => {
  return http.post('/login', { email: input.email, password: input.password });
};
