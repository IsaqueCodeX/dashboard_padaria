import { create } from 'zustand';
import { User } from '@/types';
import { mockUser } from '@/lib/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (username: string, password: string) => {
    // Mock authentication - in production, this would be a real API call
    if (username === 'admin' && password === 'padaria123') {
      const userData = { user: mockUser, isAuthenticated: true };
      set(userData);
      localStorage.setItem('auth-storage', JSON.stringify(userData));
      return true;
    }
    return false;
  },
  logout: () => {
    const data = { user: null, isAuthenticated: false };
    set(data);
    localStorage.removeItem('auth-storage');
  }
}));