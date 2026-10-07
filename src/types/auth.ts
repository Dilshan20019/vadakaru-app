export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
