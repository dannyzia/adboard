import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;
  private requestQueue: Map<string, Promise<any>> = new Map();

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
        // Prefer adminToken when present (admin UI) otherwise use user token
        const adminToken = localStorage.getItem('adminToken');
        const userToken = localStorage.getItem('token');
        const token = adminToken || userToken;
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

  private getRequestKey(config: any): string {
    return `${config.method?.toUpperCase()}_${config.url}`;
  }

  private async makeRequest(config: any): Promise<any> {
    const key = this.getRequestKey(config);
    
    // If there's already a request in progress for this endpoint, wait for it
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key);
    }

    // Create the request promise
    const requestPromise = this.api.request(config)
      .finally(() => {
        // Remove from queue when done
        this.requestQueue.delete(key);
      });

    // Add to queue
    this.requestQueue.set(key, requestPromise);
    
    return requestPromise;
  }

  public async get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.makeRequest({ ...config, method: 'get', url });
  }

  public async post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.makeRequest({ ...config, method: 'post', url, data });
  }

  public async put<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.makeRequest({ ...config, method: 'put', url, data });
  }

  public async delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.makeRequest({ ...config, method: 'delete', url });
  }

  public getApi() {
    return this.api;
  }
}

export const apiService = new ApiService();
export const api = apiService.getApi();
