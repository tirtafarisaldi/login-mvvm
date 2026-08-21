import { UserInput, UserModel, IUserResponse } from '../models/UserModel';
import { Result } from '../vo/Result';
import { BaseRepository } from './BaseRepositories';

export type UserResult = Result<UserModel>;

export interface CheckUserResult extends BaseRepository<UserResult> {}

export interface CreateUserResult extends BaseRepository<UserResult> {
  createUser: (input: UserInput) => Promise<UserResult>;
}

export interface EditUserResult extends BaseRepository<UserResult> {
  editUser: (id: string, input: UserInput) => Promise<UserResult>;
}

export interface DeleteUserResult extends BaseRepository<UserResult> {
  deleteUser: (id: string) => Promise<UserResult>;
}
