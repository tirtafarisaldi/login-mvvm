import http from 'service/http';
import { IUserPaginationResponse } from 'src/domain/models/UserModel';

export const checkUser = async () => {
  const { data } = await http.get('user/checkuser');
  return data;
};
