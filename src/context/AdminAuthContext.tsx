import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { User, AuthResponse } from '../types';

interface AdminAuthContextType {
  admin: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get<{ user: User }>('/auth/me');
        if (response.data.user && response.data.user.role === 'admin') {
          setAdmin(response.data.user);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        delete api.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('[AdminAuth] Starting login for:', email);
      // For development, use mock authentication
      const USE_MOCK = false;
      
      if (USE_MOCK) {
        // Mock admin login
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (email === 'admin@adboard.com' && password === 'admin123') {
          const mockAdmin: User = {
            _id: 'admin-1',
            name: 'Admin User',
            email: 'admin@adboard.com',
            role: 'admin',
            status: 'active',
            memberSince: new Date().toISOString(),
            subscription: {
              tier: 'pro',
              adsRemaining: 999,
            },
            favorites: [],
          };
          const mockToken = 'mock-admin-token-' + Date.now();
          
          localStorage.setItem('adminToken', mockToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
          setAdmin(mockAdmin);
          return;
        } else {
          throw new Error('Invalid admin credentials');
        }
      }

      // Real API call - use regular auth endpoint
      console.log('[AdminAuth] Calling API login endpoint');
      const response = await api.post<{ success: boolean; user: User; token: string }>('/auth/login', { email, password });
      console.log('[AdminAuth] API response received:', response.data);
      const { user, token } = response.data;

      if (user.role !== 'admin') {
        console.error('[AdminAuth] User is not admin:', user.role);
        throw new Error('Unauthorized: Admin access required');
      }

      console.log('[AdminAuth] Setting admin token and user');
      localStorage.setItem('adminToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAdmin(user);
      console.log('[AdminAuth] Login complete, admin set:', user.email);
    } catch (error: any) {
      console.error('[AdminAuth] Login failed:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  const value: AdminAuthContextType = {
    admin,
    loading,
    login,
    logout,
    isAdmin: admin?.role === 'admin',
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
