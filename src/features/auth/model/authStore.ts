'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/shared/types';
import { mockUsers } from '@/mock/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (role: UserRole) => {
        const user = mockUsers.find((u) => u.role === role && u.status === 'active');
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'buildcrm-auth',
    }
  )
);
