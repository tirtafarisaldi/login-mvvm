import { IUser, UserModel } from '../../domain/models/UserModel';

export const mapToUserModel = (user: IUser): UserModel =>
  new UserModel({
    uuid: user.uuid,
    email: user.email,
    name: user.name,
    bio_description: user.bio_description,
    avatar: user.avatar
  });
