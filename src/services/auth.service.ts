import { api } from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

// Flag to use mock authentication (set to false when backend is ready)
const USE_MOCK_AUTH = false;

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser: User = {
        _id: 'mock-user-1',
        name: data.name,
        email: data.email,
        memberSince: new Date().toISOString(),
        role: 'user',
        status: 'active',
        subscription: {
          tier: 'free',
          adsRemaining: 5,
        },
        favorites: [],
      };
      
      const mockResponse: AuthResponse = {
        user: mockUser,
        token: 'mock-token-' + Math.random().toString(36),
      };
      
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      return mockResponse;
    }
    
    const response = await api.post<any>('/auth/register', data);
    const { user, token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { user, token };
  },

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser: User = {
        _id: 'mock-user-1',
        name: 'Demo User',
        email: credentials.email,
        memberSince: new Date().toISOString(),
        role: 'user',
        status: 'active',
        subscription: {
          tier: 'free',
          adsRemaining: 5,
        },
        favorites: [],
      };
      
      const mockResponse: AuthResponse = {
        user: mockUser,
        token: 'mock-token-' + Math.random().toString(36),
      };
      
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      return mockResponse;
    }
    
    const response = await api.post<any>('/auth/login', credentials);
    const { user, token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { user, token };
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Get user from localStorage
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
