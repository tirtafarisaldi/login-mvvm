import * as UserRepositoryImpl from '../../../data/repositories/UserRepositoryImpl';

export const useCurrentUserViewModel = () => {
  const currentUserRepository = UserRepositoryImpl.useCurrentUser();
  const { result } = currentUserRepository;

  return {
    currentUser: result.data,
    loading: result.loading,
    error: result.error
  };
};