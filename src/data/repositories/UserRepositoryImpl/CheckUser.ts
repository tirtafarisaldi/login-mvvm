import * as UserDataSource from '../../sources/UserDataSource';
import { useQuery } from 'react-query';
import type { UserRole } from '../../../domain/models/UserModel';

export interface CheckUserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const useCheckUser = (enabled: boolean) => {
  const query = useQuery<CheckUserData>(
    ['users'],
    () => UserDataSource.checkUser(),
    { enabled }
  );

  return {
    data: query.data,
    error: query.error as any,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
