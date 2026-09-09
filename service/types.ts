import type { UserRole } from 'src/domain/models/UserModel';

export type AuthUser = {
  name: string;
  email: string;
  role: UserRole;
};

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isAutoLogin: boolean;
  isAutoLogout: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}
