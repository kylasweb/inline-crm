import { StateCreator } from 'zustand';
import { createPersistStore } from './config';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  permissions: string[];
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

const createAuthSlice: StateCreator<AuthState> = (set, get) => ({
  ...initialState,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        role: 'user',
        permissions: ['read:leads', 'write:leads'],
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=test-user'
      };
      const mockToken = 'mock-jwt-token';
      
      set({ 
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login',
        loading: false 
      });
    }
  },

  logout: () => {
    set(initialState);
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      // TODO: Implement token validation logic
      const { token } = get();
      if (!token) {
        throw new Error('No token found');
      }
      
      set({ loading: false });
    } catch (error) {
      set({ 
        ...initialState,
        error: error instanceof Error ? error.message : 'Session expired'
      });
    }
  },

  hasPermission: (permission: string) => {
    const { user } = get();
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === 'admin';
  },

  clearError: () => {
    set({ error: null });
  }
});

export const useAuthStore = createPersistStore(createAuthSlice, 'auth-store', 1);