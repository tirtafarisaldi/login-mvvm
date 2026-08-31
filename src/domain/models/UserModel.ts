import { IPaginationResponse, Pagination } from '../vo/Pagination';
import { GeneralStatus, Status } from '../vo/Status';
import { BaseModel } from './BaseModel';

export type UserRole = 'member' | 'admin';

export interface IUser {
  uuid: string;
  name: string;
  avatar: string;
  bio_description: string;
  email: string;
  role: UserRole;
}

export interface IUserResponse {
  user: IUser;
}

export interface IUserStatusResponse {
  message: string;
  status: boolean;
}

export interface IUserPaginationResponse extends IPaginationResponse {
  users: IUser[];
}

export class UserModel extends BaseModel {
  name;
  avatar;
  bio_description;
  email;
  role;

  constructor(data: IUser) {
    super(data.uuid);

    this.name = data.name;
    this.avatar = data.avatar;
    this.bio_description = data.bio_description;
    this.email = data.email;
    this.role = data.role;
  }
}

export interface UserInput {
  email: string;
}
