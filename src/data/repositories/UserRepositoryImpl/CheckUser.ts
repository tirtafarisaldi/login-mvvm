import * as UserDataSource from '../../sources/UserDataSource';
import { useQuery } from 'react-query';

export const useCheckUser = () => {
  const { error, isLoading } = useQuery(['users'], () => UserDataSource.checkUser());

  return {
    error: error as any,
    isLoading
  };
};