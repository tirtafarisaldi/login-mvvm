export type AuthUser = {
  name: string;
  email: string;
  role: 'member' | 'admin';
};

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isAutoLogin: boolean;
  isAutoLogout: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}
