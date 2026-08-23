import * as UserDataSource from '../../sources/UserDataSource';
import { useQuery } from 'react-query';

export const useCheckUser = (enabled: boolean) => {
  const { error, isLoading } = useQuery(
    ['users'],
    () => UserDataSource.checkUser(),
    { enabled }
  );

  return {
    error: error as any,
    isLoading,
  };
};
