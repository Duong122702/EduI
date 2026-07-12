import { create } from 'zustand';
import type { User } from '../Models/user.model';

export type UserRole = 'STUDENT' | 'TEACHER';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loginSuccess: (accessToken: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  role: null,
  isAuthenticated: false,
  loginSuccess: (accessToken, user) =>
    set({ accessToken, user, isAuthenticated: true }),
  logout: () => {
    import('js-cookie').then((Cookies) => {
      Cookies.default.remove('refresh_token');
    });
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
