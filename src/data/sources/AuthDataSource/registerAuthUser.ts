import http from 'service/http';

export interface RegisterByEmailInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerByEmail = async (input: RegisterByEmailInput) => {
  return http.post('/register', {
    name: input.name,
    email: input.email,
    password: input.password,
    confirm_password: input.confirmPassword,
  });
};
