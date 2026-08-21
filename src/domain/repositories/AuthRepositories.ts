import { AuthModel, LoginInput, RegisterInput } from '../models/AuthModel';
import { Result } from '../vo/Result';
import { BaseRepository } from './BaseRepositories';

export type AuthResult = Result<AuthModel>;

export interface LoginAuthResult extends BaseRepository<AuthResult> {
  loginByEmail: (input: LoginInput) => Promise<AuthResult>;
}

export interface RegisterAuthResult extends BaseRepository<AuthResult> {
  registerByEmail: (input: RegisterInput) => Promise<AuthResult>;
}
