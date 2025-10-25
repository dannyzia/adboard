import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      // Handle error
      console.error('OAuth error:', error);
      alert('Google login failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token) {
      // Extract user data from JWT (decode without verification - just for display)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          _id: payload.id,
          email: payload.email,
          name: payload.name || payload.email,
          role: payload.role,
          memberSince: payload.memberSince,
          subscription: payload.subscription || {
            tier: 'free',
            adsRemaining: 5,
            status: 'active'
          },
          favorites: payload.favorites || []
        };

        // Store token and user
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to homepage
        window.location.href = '/';
      } catch (err) {
        console.error('Failed to parse token:', err);
        navigate('/login');
      }
    } else {
      // No token, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing Google Sign-In</h2>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
};
