import http from 'service/http';
import { IUserPaginationResponse } from 'src/domain/models/UserModel';

export const getUsers = async (
  email?: string,
  page?: number
): Promise<IUserPaginationResponse> => {
  const { data } = await http.get<IUserPaginationResponse>('users', {
    params: {
      email,
      page,
    },
  });
  return data;
};
