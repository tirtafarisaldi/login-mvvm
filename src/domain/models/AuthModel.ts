import { BaseModel } from './BaseModel';

export interface IAuth {
  id?: string;
  email: string;
  password: string;
  name?: string;
  confirm_password?: string;
  accessToken?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
  confirm_password: string;
}

export interface AuthResponse {
  accessToken?: string;
  user?: Partial<IAuth>;
  message?: string;
}

export class AuthModel extends BaseModel {
  email;
  accessToken;

  constructor(data: IAuth) {
    super(data.id || data.email);

    this.email = data.email;
    this.accessToken = data.accessToken || '';
  }
}
