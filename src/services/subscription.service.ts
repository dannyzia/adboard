import { api } from './api';
import { SubscriptionPlan, CreateSubscriptionPlanData } from '../types/subscription.types';

// Flag to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = false;

// Mock subscription plans data
const mockPlans: SubscriptionPlan[] = [
  {
    _id: 'plan-free-1',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: {
      adsPerMonth: 5,
      listingDuration: 7,
      imagesPerAd: 2,
      maxImageSize: 2,
      isFeatured: false,
      hasAnalytics: false,
      hasPrioritySupport: false,
      hasPriorityPlacement: false,
      hasApiAccess: false,
      hasCustomBranding: false,
      allowedCategories: [],
    },
    isActive: true,
    isVisible: true,
    displayOrder: 1,
    metadata: {
      description: 'Perfect for trying out AdBoard',
      badge: '',
      color: '#6B7280',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    _id: 'plan-basic-monthly-1',
    name: 'Basic',
    tier: 'basic',
    price: 999, // $9.99
    currency: 'USD',
    interval: 'month',
    features: {
      adsPerMonth: 20,
      listingDuration: 30,
      imagesPerAd: 5,
      maxImageSize: 5,
      isFeatured: true,
      hasAnalytics: true,
      hasPrioritySupport: false,
      hasPriorityPlacement: false,
      hasApiAccess: false,
      hasCustomBranding: false,
      allowedCategories: [],
    },
    isActive: true,
    isVisible: true,
    displayOrder: 2,
    metadata: {
      description: 'For regular sellers and businesses',
      badge: 'POPULAR',
      color: '#3B82F6',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin-1',
  },
  {
    _id: 'plan-pro-monthly-1',
    name: 'Pro',
    tier: 'pro',
    price: 2999, // $29.99
    currency: 'USD',
    interval: 'month',
    features: {
      adsPerMonth: 'unlimited',
      listingDuration: 90,
      imagesPerAd: 10,
      maxImageSize: 10,
      isFeatured: true,
      hasAnalytics: true,
      hasPrioritySupport: true,
      hasPriorityPlacement: true,
      hasApiAccess: true,
      hasCustomBranding: true,
      allowedCategories: [],
    },
    isActive: true,
    isVisible: true,
    displayOrder: 3,
    metadata: {
      description: 'For power users and growing businesses',
      badge: 'BEST VALUE',
      color: '#8B5CF6',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin-1',
  },
];

export const subscriptionService = {
  /**
   * Get all subscription plans (admin)
   */
  async getAllPlans(): Promise<SubscriptionPlan[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...mockPlans];
    }
    
    const response = await api.get<{ success: boolean; plans: SubscriptionPlan[] }>('/subscriptions/admin/plans');
    return response.data.plans;
  },

  /**
   * Get active visible plans (public)
   */
  async getActivePlans(): Promise<SubscriptionPlan[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockPlans.filter(p => p.isActive && p.isVisible);
    }
    
    const response = await api.get<{ success: boolean; plans: SubscriptionPlan[] }>('/subscriptions/plans');
    return response.data.plans;
  },

  /**
   * Get single plan by ID
   */
  async getPlanById(id: string): Promise<SubscriptionPlan> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const plan = mockPlans.find(p => p._id === id);
      if (!plan) throw new Error('Plan not found');
      return plan;
    }
    
    const response = await api.get<{ success: boolean; plan: SubscriptionPlan }>(`/subscriptions/${id}`);
    return response.data.plan;
  },

  /**
   * Create new subscription plan
   */
  async createPlan(data: CreateSubscriptionPlanData): Promise<SubscriptionPlan> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPlan: SubscriptionPlan = {
        _id: `plan-${data.tier}-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin-1',
      };
      
      mockPlans.push(newPlan);
      return newPlan;
    }
    
    const response = await api.post<{ success: boolean; plan: SubscriptionPlan }>('/subscriptions/admin/plans', data);
    return response.data.plan;
  },

  /**
   * Update subscription plan
   */
  async updatePlan(id: string, data: Partial<CreateSubscriptionPlanData>): Promise<SubscriptionPlan> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockPlans.findIndex(p => p._id === id);
      if (index === -1) throw new Error('Plan not found');
      
      mockPlans[index] = {
        ...mockPlans[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      return mockPlans[index];
    }
    
    const response = await api.put<{ success: boolean; plan: SubscriptionPlan }>(`/subscriptions/admin/plans/${id}`, data);
    return response.data.plan;
  },

  /**
   * Delete subscription plan
   */
  async deletePlan(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockPlans.findIndex(p => p._id === id);
      if (index === -1) throw new Error('Plan not found');
      
      // Don't actually delete the free plan
      if (mockPlans[index].tier === 'free') {
        throw new Error('Cannot delete free plan');
      }
      
      mockPlans.splice(index, 1);
      return;
    }
    
    await api.delete(`/subscriptions/admin/plans/${id}`);
  },

  /**
   * Toggle plan visibility
   */
  async togglePlanVisibility(id: string): Promise<SubscriptionPlan> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockPlans.findIndex(p => p._id === id);
      if (index === -1) throw new Error('Plan not found');
      
      mockPlans[index].isVisible = !mockPlans[index].isVisible;
      mockPlans[index].updatedAt = new Date().toISOString();
      
      return mockPlans[index];
    }
    
    const response = await api.patch<{ plan: SubscriptionPlan }>(`/admin/subscriptions/${id}/toggle-visibility`);
    return response.data.plan;
  },

  /**
   * Toggle plan active status
   */
  async togglePlanStatus(id: string): Promise<SubscriptionPlan> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockPlans.findIndex(p => p._id === id);
      if (index === -1) throw new Error('Plan not found');
      
      mockPlans[index].isActive = !mockPlans[index].isActive;
      mockPlans[index].updatedAt = new Date().toISOString();
      
      return mockPlans[index];
    }
    
    const response = await api.patch<{ plan: SubscriptionPlan }>(`/admin/subscriptions/${id}/toggle-status`);
    return response.data.plan;
  },
};
