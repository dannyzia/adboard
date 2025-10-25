import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdProvider } from './context/AdContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { HomePage } from './pages/HomePage';
import { AdDetailPage } from './pages/AdDetailPage';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { PostAdPage } from './pages/PostAdPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminAdsPage } from './pages/AdminAdsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminArchivePage } from './pages/AdminArchivePage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AdminSubscriptionsPage } from './pages/AdminSubscriptionsPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';

function App() {
  return (
    <AuthProvider>
      <AdProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/ad/:id" element={<AdDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/checkout/:tier" element={<CheckoutPage />} />
              
              {/* User Routes */}
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/post-ad" element={<PostAdPage />} />
              
              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/ads"
                element={
                  <ProtectedAdminRoute>
                    <AdminAdsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedAdminRoute>
                    <AdminUsersPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedAdminRoute>
                    <AdminReportsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/archive"
                element={
                  <ProtectedAdminRoute>
                    <AdminArchivePage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedAdminRoute>
                    <AdminAnalyticsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/subscriptions"
                element={
                  <ProtectedAdminRoute>
                    <AdminSubscriptionsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedAdminRoute>
                    <AdminSettingsPage />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </AdProvider>
    </AuthProvider>
  );
}

export default App;
