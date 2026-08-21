export interface AuthContextValue {
  isAuthenticated: boolean;
  user: unknown | null;
  isAutoLogin: boolean;
  isAutoLogout: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}
