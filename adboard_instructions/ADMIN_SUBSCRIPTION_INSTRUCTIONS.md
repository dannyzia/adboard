# GitHub Copilot Instructions: Admin & Subscription Management

## Overview
This document extends the main AdBoard project with complete admin subscription management and user purchase functionality using Stripe.

---

## 🎯 Features Overview

### Admin Features
- Create, edit, delete subscription plans
- View all users and their subscriptions
- Manually override user subscriptions
- View platform analytics
- Manage featured ads

### User Features
- View available subscription plans
- Purchase/upgrade subscriptions via Stripe
- Downgrade or cancel subscriptions
- View subscription history
- Automatic renewal handling

---

## 📊 Data Models

### 1. SubscriptionPlan Schema
```typescript
interface SubscriptionPlan {
  _id: string;
  name: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  price: number; // in cents (e.g., 1500 = $15.00)
  currency: string; // 'USD', 'EUR', etc.
  interval: 'month' | 'year';
  
  features: {
    adsPerMonth: number | 'unlimited'; // -1 for unlimited
    listingDuration: number; // days
    imagesPerAd: number;
    maxImageSize: number; // in MB
    isFeatured: boolean;
    hasAnalytics: boolean;
    hasPrioritySupport: boolean;
    hasPriorityPlacement: boolean;
    hasApiAccess: boolean;
    hasCustomBranding: boolean;
    allowedCategories: string[]; // empty = all
  };
  
  stripePriceId?: string; // Stripe Price ID
  stripeProductId?: string; // Stripe Product ID
  
  isActive: boolean;
  isVisible: boolean; // Show on pricing page
  displayOrder: number; // Sort order on pricing page
  
  metadata: {
    description: string;
    badge?: string; // 'POPULAR', 'BEST VALUE', etc.
    color?: string; // Hex color for UI
  };
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Admin user ID
}
```

### 2. Updated User Schema (Add Subscription Details)
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  role: 'user' | 'admin'; // Add role field
  
  subscription: {
    planId: string; // Reference to SubscriptionPlan
    tier: 'free' | 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'canceled' | 'expired' | 'past_due';
    
    // Usage tracking
    adsUsed: number; // Current period
    adsRemaining: number;
    
    // Billing
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    
    // History
    previousPlan?: string;
    upgradedAt?: Date;
    downgradedAt?: Date;
  };
  
  favorites: string[];
  memberSince: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Payment Transaction Schema
```typescript
interface PaymentTransaction {
  _id: string;
  userId: string;
  planId: string;
  
  amount: number; // in cents
  currency: string;
  
  type: 'purchase' | 'upgrade' | 'downgrade' | 'renewal' | 'refund';
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  
  metadata: {
    oldPlan?: string;
    newPlan?: string;
    prorated?: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints

### Admin - Subscription Plans
```typescript
// Get all plans (including inactive)
GET    /api/admin/subscriptions
Response: { plans: SubscriptionPlan[] }

// Get single plan
GET    /api/admin/subscriptions/:id
Response: { plan: SubscriptionPlan }

// Create new plan
POST   /api/admin/subscriptions
Body: {
  name: string;
  tier: string;
  price: number;
  interval: string;
  features: {...};
  metadata: {...};
}
Response: { plan: SubscriptionPlan }

// Update plan
PUT    /api/admin/subscriptions/:id
Body: Partial<SubscriptionPlan>
Response: { plan: SubscriptionPlan }

// Delete plan (soft delete - mark as inactive)
DELETE /api/admin/subscriptions/:id
Response: { success: boolean }

// Sync with Stripe (create Stripe product/price)
POST   /api/admin/subscriptions/:id/sync-stripe
Response: { stripePriceId: string, stripeProductId: string }
```

### Admin - User Management
```typescript
// Get all users with pagination
GET    /api/admin/users?page=1&limit=50&search=&tier=
Response: {
  users: User[];
  pagination: { page, totalPages, totalUsers };
}

// Get user details
GET    /api/admin/users/:userId
Response: { user: User, stats: {...} }

// Manually update user subscription
PUT    /api/admin/users/:userId/subscription
Body: {
  planId: string;
  reason: string; // Admin note
}
Response: { user: User }

// Cancel user subscription
POST   /api/admin/users/:userId/cancel-subscription
Body: { reason: string }
Response: { success: boolean }

// Grant free trial
POST   /api/admin/users/:userId/grant-trial
Body: {
  planId: string;
  duration: number; // days
}
Response: { success: boolean }
```

### Admin - Analytics
```typescript
// Platform statistics
GET    /api/admin/analytics/stats
Response: {
  totalUsers: number;
  totalAds: number;
  totalRevenue: number;
  activeSubscriptions: number;
  subscriptionsByTier: {
    free: number;
    basic: number;
    pro: number;
    enterprise: number;
  };
  revenueByMonth: Array<{month: string, revenue: number}>;
  newUsersThisMonth: number;
  churnRate: number;
}

// Revenue report
GET    /api/admin/analytics/revenue?startDate=&endDate=
Response: {
  totalRevenue: number;
  transactions: PaymentTransaction[];
  breakdown: {...};
}
```

### User - Subscriptions (Public)
```typescript
// Get available plans (active only)
GET    /api/subscriptions/plans
Response: { plans: SubscriptionPlan[] }

// Get current user's subscription
GET    /api/subscriptions/my-subscription
Response: { subscription: {...}, usage: {...} }
```

### User - Payments
```typescript
// Create Stripe checkout session
POST   /api/payments/create-checkout-session
Body: {
  planId: string;
  interval: 'month' | 'year';
  successUrl: string;
  cancelUrl: string;
}
Response: { sessionId: string, url: string }

// Stripe webhook (for events)
POST   /api/payments/webhook
Headers: stripe-signature
Body: Stripe Event JSON
Response: { received: true }

// Get subscription status
GET    /api/payments/subscription-status
Response: {
  status: 'active' | 'canceled' | 'expired';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Cancel subscription
POST   /api/payments/cancel-subscription
Body: { cancelImmediately: boolean } // false = end of period
Response: { success: boolean, effectiveDate: Date }

// Upgrade subscription
POST   /api/payments/upgrade-subscription
Body: { newPlanId: string }
Response: { success: boolean, prorated: number }

// Downgrade subscription
POST   /api/payments/downgrade-subscription
Body: { newPlanId: string }
Response: { success: boolean, effectiveDate: Date }

// Get payment history
GET    /api/payments/history?page=1&limit=20
Response: {
  transactions: PaymentTransaction[];
  pagination: {...};
}

// Download invoice
GET    /api/payments/invoice/:invoiceId/download
Response: PDF file
```

---

## 🎨 UI Components

### 1. Admin Panel Pages

#### AdminDashboard.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Stats {
  totalUsers: number;
  totalAds: number;
  totalRevenue: number;
  activeSubscriptions: number;
  subscriptionsByTier: Record<string, number>;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/analytics/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="users"
          color="blue"
        />
        <StatsCard
          title="Total Ads"
          value={stats?.totalAds || 0}
          icon="document"
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${((stats?.totalRevenue || 0) / 100).toFixed(2)}`}
          icon="currency"
          color="purple"
        />
        <StatsCard
          title="Active Subscriptions"
          value={stats?.activeSubscriptions || 0}
          icon="star"
          color="orange"
        />
      </div>

      {/* Subscription Breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Subscriptions by Tier</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(stats?.subscriptionsByTier || {}).map(([tier, count]) => (
            <div key={tier} className="text-center">
              <div className="text-3xl font-bold text-blue-600">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{tier}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Manage Plans"
          description="Create or edit subscription plans"
          link="/admin/subscriptions"
          icon="settings"
        />
        <QuickActionCard
          title="Manage Users"
          description="View and manage user accounts"
          link="/admin/users"
          icon="users"
        />
        <QuickActionCard
          title="View Analytics"
          description="Detailed revenue and usage reports"
          link="/admin/analytics"
          icon="chart"
        />
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center`}>
          {/* Add icon SVG here */}
        </div>
      </div>
    </div>
  );
};
```

#### ManageSubscriptionPlans.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SubscriptionPlan } from '../types';

export const ManageSubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/admin/subscriptions');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowModal(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await api.delete(`/admin/subscriptions/${planId}`);
      fetchPlans();
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Subscription Plans</h1>
        <button
          onClick={handleCreatePlan}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Create New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan._id}
            plan={plan}
            onEdit={() => handleEditPlan(plan)}
            onDelete={() => handleDeletePlan(plan._id)}
          />
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <PlanFormModal
          plan={editingPlan}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchPlans();
          }}
        />
      )}
    </div>
  );
};

interface PlanCardProps {
  plan: SubscriptionPlan;
  onEdit: () => void;
  onDelete: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 hover:border-blue-500 transition">
      {/* Plan Badge */}
      {plan.metadata.badge && (
        <div className="text-center mb-4">
          <span className="bg-blue-600 text-white text-sm px-4 py-1 rounded-full font-semibold">
            {plan.metadata.badge}
          </span>
        </div>
      )}

      {/* Plan Name & Price */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
        <div className="text-4xl font-bold text-blue-600 mb-2">
          ${(plan.price / 100).toFixed(2)}
          <span className="text-lg text-gray-600">/{plan.interval}</span>
        </div>
        <p className="text-sm text-gray-600">{plan.metadata.description}</p>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-6">
        <li className="flex items-center text-sm">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {plan.features.adsPerMonth === 'unlimited' 
            ? 'Unlimited ads' 
            : `${plan.features.adsPerMonth} ads per month`}
        </li>
        <li className="flex items-center text-sm">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {plan.features.listingDuration}-day listings
        </li>
        <li className="flex items-center text-sm">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Up to {plan.features.imagesPerAd} images
        </li>
        {plan.features.isFeatured && (
          <li className="flex items-center text-sm">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Featured badge
          </li>
        )}
      </ul>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`text-xs px-2 py-1 rounded ${
          plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {plan.isActive ? 'Active' : 'Inactive'}
        </span>
        {plan.stripePriceId && (
          <span className="ml-2 text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
            Stripe Synced
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
```

#### PlanFormModal.tsx
```typescript
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';
import { SubscriptionPlan } from '../types';

interface PlanFormModalProps {
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSave: () => void;
}

export const PlanFormModal: React.FC<PlanFormModalProps> = ({ plan, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: plan || {
      name: '',
      tier: 'basic',
      price: 0,
      interval: 'month',
      features: {
        adsPerMonth: 20,
        listingDuration: 30,
        imagesPerAd: 3,
        maxImageSize: 5,
        isFeatured: false,
        hasAnalytics: false,
        hasPrioritySupport: false,
        hasPriorityPlacement: false,
        hasApiAccess: false,
        hasCustomBranding: false,
      },
      metadata: {
        description: '',
        badge: '',
      },
      isActive: true,
      isVisible: true,
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (plan) {
        await api.put(`/admin/subscriptions/${plan._id}`, data);
      } else {
        await api.post('/admin/subscriptions', data);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save plan:', error);
      alert('Failed to save plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {plan ? 'Edit Plan' : 'Create New Plan'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Plan Name *
              </label>
              <input
                {...register('name', { required: 'Plan name is required' })}
                type="text"
                placeholder="e.g., Basic Plan"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tier *
              </label>
              <select
                {...register('tier', { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (in cents) *
              </label>
              <input
                {...register('price', { required: true, min: 0 })}
                type="number"
                placeholder="1500 = $15.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Enter amount in cents (e.g., 1500 for $15.00)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Billing Interval *
              </label>
              <select
                {...register('interval', { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('metadata.description')}
              rows={3}
              placeholder="Brief description of this plan"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Badge (Optional)
            </label>
            <input
              {...register('metadata.badge')}
              type="text"
              placeholder="e.g., POPULAR, BEST VALUE"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ads Per Month *
                </label>
                <input
                  {...register('features.adsPerMonth', { required: true })}
                  type="number"
                  placeholder="Enter number or -1 for unlimited"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Use -1 for unlimited</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Listing Duration (days) *
                </label>
                <input
                  {...register('features.listingDuration', { required: true, min: 1 })}
                  type="number"
                  placeholder="30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Images Per Ad *
                </label>
                <input
                  {...register('features.imagesPerAd', { required: true, min: 1 })}
                  type="number"
                  placeholder="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Image Size (MB) *
                </label>
                <input
                  {...register('features.maxImageSize', { required: true, min: 1 })}
                  type="number"
                  placeholder="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <label className="flex items-center space-x-3">
                <input
                  {...register('features.isFeatured')}
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Badge</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  {...register('features.hasAnalytics')}
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Analytics</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  {...register('features.hasPrioritySupport')}
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Priority Support</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  {...register('features.hasPriorityPlacement')}
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Priority Placement</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  {...register('features.hasApiAccess')}
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">API Access</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  {...register('features.hasCustomBranding')}
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Custom Branding</span>
              </label>
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Visibility</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active (can be assigned to users)</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  {...register('isVisible')}
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Visible (show on pricing page)</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

### 2. User-Facing Pages

#### CheckoutPage.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { api } from '../services/api';
import { SubscriptionPlan } from '../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const CheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  const fetchPlan = async () => {
    try {
      const response = await api.get(`/subscriptions/plans/${planId}`);
      setPlan(response.data.plan);
    } catch (error) {
      console.error('Failed to fetch plan:', error);
      navigate('/pricing');
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await api.post('/payments/create-checkout-session', {
        planId,
        interval,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/pricing`,
      });

      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600 mb-8">Complete your subscription purchase</p>

          {/* Plan Summary */}
          <div className="border rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
                <p className="text-gray-600 mt-1">{plan.metadata.description}</p>
              </div>
              {plan.metadata.badge && (
                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {plan.metadata.badge}
                </span>
              )}
            </div>

            {/* Billing Interval Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Billing Interval
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setInterval('month')}
                  className={`flex-1 py-3 px-4 border-2 rounded-lg font-semibold transition ${
                    interval === 'month'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Monthly
                  <div className="text-2xl font-bold mt-1">
                    ${(plan.price / 100).toFixed(2)}/mo
                  </div>
                </button>
                <button
                  onClick={() => setInterval('year')}
                  className={`flex-1 py-3 px-4 border-2 rounded-lg font-semibold transition ${
                    interval === 'year'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Yearly
                  <div className="text-2xl font-bold mt-1">
                    ${((plan.price * 12 * 0.8) / 100).toFixed(2)}/yr
                  </div>
                  <span className="text-xs text-green-600">Save 20%</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">What's Included:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {plan.features.adsPerMonth === 'unlimited' 
                    ? 'Unlimited ads per month' 
                    : `${plan.features.adsPerMonth} ads per month`}
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {plan.features.listingDuration}-day listing duration
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Up to {plan.features.imagesPerAd} images per ad
                </li>
                {plan.features.isFeatured && (
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Featured badge on ads
                  </li>
                )}
                {plan.features.hasAnalytics && (
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced analytics
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-b py-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total Due Today:</span>
              <span className="text-3xl font-bold text-blue-600">
                ${interval === 'month' 
                  ? (plan.price / 100).toFixed(2) 
                  : ((plan.price * 12 * 0.8) / 100).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Billed {interval === 'month' ? 'monthly' : 'annually'}. Cancel anytime.
            </p>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            Your payment is processed securely by Stripe.
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

## 🔧 Backend Implementation

### Stripe Webhook Handler
```typescript
import express from 'express';
import Stripe from 'stripe';
import { User } from '../models/User';
import { PaymentTransaction } from '../models/PaymentTransaction';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const stripeWebhook = async (req: express.Request, res: express.Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) return;

  try {
    // Update user subscription
    await User.findByIdAndUpdate(userId, {
      'subscription.planId': planId,
      'subscription.status': 'active',
      'subscription.stripeCustomerId': session.customer,
      'subscription.stripeSubscriptionId': session.subscription,
      'subscription.currentPeriodStart': new Date(),
      'subscription.currentPeriodEnd': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Create payment transaction record
    await PaymentTransaction.create({
      userId,
      planId,
      amount: session.amount_total,
      currency: session.currency,
      type: 'purchase',
      status: 'succeeded',
      stripePaymentIntentId: session.payment_intent,
    });

    console.log(`Subscription activated for user ${userId}`);
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const stripeSubscriptionId = subscription.id;

  try {
    const user = await User.findOne({ 'subscription.stripeSubscriptionId': stripeSubscriptionId });
    if (!user) return;

    user.subscription.status = subscription.status === 'active' ? 'active' : 'canceled';
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;

    await user.save();
    console.log(`Subscription updated for user ${user._id}`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const stripeSubscriptionId = subscription.id;

  try {
    const user = await User.findOne({ 'subscription.stripeSubscriptionId': stripeSubscriptionId });
    if (!user) return;

    // Downgrade to free plan
    const freePlan = await SubscriptionPlan.findOne({ tier: 'free' });
    if (freePlan) {
      user.subscription.planId = freePlan._id;
      user.subscription.tier = 'free';
      user.subscription.status = 'active';
      user.subscription.stripeSubscriptionId = undefined;
    }

    await user.save();
    console.log(`Subscription canceled for user ${user._id}, downgraded to free`);
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Record successful payment
  console.log(`Payment succeeded for invoice ${invoice.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const stripeCustomerId = invoice.customer as string;

  try {
    const user = await User.findOne({ 'subscription.stripeCustomerId': stripeCustomerId });
    if (!user) return;

    // Mark subscription as past_due
    user.subscription.status = 'past_due';
    await user.save();

    // Send notification email (implement separately)
    console.log(`Payment failed for user ${user._id}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
```

### Create Checkout Session Endpoint
```typescript
export const createCheckoutSession = async (req: express.Request, res: express.Response) => {
  try {
    const { planId, interval, successUrl, cancelUrl } = req.body;
    const userId = req.user!._id; // From auth middleware

    // Get plan details
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Calculate price based on interval
    let price = plan.price;
    if (interval === 'year') {
      price = Math.floor(plan.price * 12 * 0.8); // 20% discount for yearly
    }

    // Create or get Stripe customer
    let stripeCustomerId = req.user!.subscription.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user!.email,
        metadata: {
          userId: userId.toString(),
        },
      });
      stripeCustomerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: plan.currency || 'usd',
            product_data: {
              name: plan.name,
              description: plan.metadata.description,
            },
            unit_amount: price,
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId.toString(),
        planId: planId.toString(),
      },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: error.message });
  }
};
```

---

## 🎯 Implementation Checklist

### Phase 1: Database Setup
- [ ] Create SubscriptionPlan model
- [ ] Update User model with subscription fields
- [ ] Create PaymentTransaction model
- [ ] Add indexes for performance

### Phase 2: Admin Backend
- [ ] Implement CRUD endpoints for subscription plans
- [ ] Implement user management endpoints
- [ ] Implement analytics endpoints
- [ ] Add admin authentication middleware

### Phase 3: Admin Frontend
- [ ] Build AdminDashboard page
- [ ] Build ManageSubscriptionPlans page
- [ ] Build PlanFormModal component
- [ ] Build ManageUsers page
- [ ] Add admin route protection

### Phase 4: Stripe Integration
- [ ] Set up Stripe account
- [ ] Configure Stripe API keys
- [ ] Implement webhook handler
- [ ] Implement checkout session creation
- [ ] Test webhook events locally (use Stripe CLI)

### Phase 5: User Frontend
- [ ] Update PricingPage to show dynamic plans
- [ ] Build CheckoutPage
- [ ] Build subscription management in Dashboard
- [ ] Add upgrade/downgrade flows
- [ ] Add cancellation flow

### Phase 6: Testing
- [ ] Test admin CRUD operations
- [ ] Test Stripe checkout flow
- [ ] Test webhook handling
- [ ] Test subscription renewals
- [ ] Test upgrade/downgrade scenarios
- [ ] Test cancellation flow

### Phase 7: Production Setup
- [ ] Set up production Stripe account
- [ ] Configure production webhook endpoint
- [ ] Set up SSL certificate
- [ ] Configure environment variables
- [ ] Deploy and monitor

---

## 🔒 Security Considerations

1. **Admin Authentication**
   - Use role-based access control (RBAC)
   - Add `isAdmin` or `role` field to User model
   - Protect all admin routes with admin middleware

2. **Stripe Security**
   - Never expose Stripe secret key on frontend
   - Always verify webhook signatures
   - Use HTTPS in production
   - Validate all prices server-side

3. **Payment Validation**
   - Verify plan exists and is active
   - Check user eligibility
   - Prevent duplicate payments
   - Log all transactions

4. **Data Protection**
   - Don't store credit card details
   - Encrypt sensitive user data
   - Follow PCI compliance guidelines
   - Regular security audits

---

## 📧 Email Notifications

Implement email notifications for:
- Successful subscription purchase
- Payment failure
- Subscription renewal reminder (3 days before)
- Subscription canceled
- Subscription upgraded/downgraded

Use services like SendGrid, Mailgun, or AWS SES.

---

## 🧪 Testing with Stripe

### Test Card Numbers
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Auth: 4000 0027 6000 3184
```

### Testing Webhooks Locally
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:5000/api/payments/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
```

---

## 📊 Analytics to Track

1. **Revenue Metrics**
   - MRR (Monthly Recurring Revenue)
   - ARR (Annual Recurring Revenue)
   - ARPU (Average Revenue Per User)

2. **User Metrics**
   - Conversion rate (free to paid)
   - Churn rate
   - Upgrade rate
   - Downgrade rate

3. **Plan Performance**
   - Most popular plan
   - Highest revenue plan
   - Conversion by plan

---

## 🚀 Deployment Notes

1. Set environment variables:
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

2. Configure webhook endpoint in Stripe Dashboard:
```
https://yourdomain.com/api/payments/webhook
```

3. Enable events in Stripe:
- checkout.session.completed
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed

---

## 🎯 GitHub Copilot Prompts

### For Admin Dashboard:
```
// Create an admin dashboard component showing:
// - Total users, ads, revenue, and active subscriptions stats
// - Subscription breakdown by tier
// - Quick action cards for managing plans, users, and analytics
// Use TypeScript, React hooks, and Tailwind CSS
```

### For Subscription Plan Form:
```
// Create a subscription plan form modal with react-hook-form:
// - Fields: name, tier, price, interval, description, badge
// - Feature toggles: adsPerMonth, listingDuration, imagesPerAd, isFeatured, etc.
// - Validation and error handling
// - Create and edit modes
```

### For Stripe Checkout:
```
// Create a checkout page component:
// - Display plan summary with features
// - Toggle between monthly and yearly billing (20% off yearly)
// - Create Stripe checkout session on button click
// - Redirect to Stripe hosted checkout page
// Use Stripe.js and TypeScript
```

### For Webhook Handler:
```
// Create a Stripe webhook handler in Express:
// - Verify webhook signature
// - Handle checkout.session.completed event
// - Update user subscription in database
// - Create payment transaction record
// - Handle subscription.updated and subscription.deleted events
```

---

Good luck building the subscription system! 🚀
