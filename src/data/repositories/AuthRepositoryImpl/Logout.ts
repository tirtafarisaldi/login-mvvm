import * as AuthDataSource from '../../sources/AuthDataSource';

export const useLogout = () => ({
  logout: () => AuthDataSource.logout(),
});
