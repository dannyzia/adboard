import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Don't redirect if we're on admin login page (user is trying to login)
          const isAdminLoginPage = window.location.pathname === '/admin/login';
          const isUserLoginPage = window.location.pathname === '/login';
          
          if (!isAdminLoginPage && !isUserLoginPage) {
            // Only redirect if user is on a protected page (not on login pages)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('adminToken');
            
            // Redirect to appropriate login based on current path
            if (window.location.pathname.startsWith('/admin')) {
              window.location.href = '/admin/login';
            } else {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public getApi() {
    return this.api;
  }
}

export const apiService = new ApiService();
export const api = apiService.getApi();
