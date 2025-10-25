export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  memberSince: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  subscription: {
    tier: 'free' | 'basic' | 'pro';
    adsRemaining: number;
    renewsAt?: string;
  };
  favorites: string[];
  suspendedUntil?: string;
  suspensionReason?: string;
  bannedAt?: string;
  banReason?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
