import { create } from 'zustand';
import type { User } from '../Models/user.model';
import Cookies from 'js-cookie';

export type UserRole = 'STUDENT' | 'TEACHER';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loginSuccess: (accessToken: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  role: null,
  isAuthenticated: false,
  loginSuccess: (accessToken, user) =>
    set({ accessToken, user, role: user.role, isAuthenticated: true }),
  logout: () => {
    Cookies.remove('refresh_token');
    set({ user: null, accessToken: null, role: null, isAuthenticated: false });
  },
}));
