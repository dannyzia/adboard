import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscription.service';
import { SubscriptionPlan, CreateSubscriptionPlanData } from '../types/subscription.types';

export const AdminSubscriptionsPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<CreateSubscriptionPlanData>({
    name: '',
    tier: 'basic',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: {
      adsPerMonth: 0,
      listingDuration: 30,
      imagesPerAd: 5,
      maxImageSize: 5,
      isFeatured: false,
      hasAnalytics: false,
      hasPrioritySupport: false,
      hasPriorityPlacement: false,
      hasApiAccess: false,
      hasCustomBranding: false,
      allowedCategories: [],
    },
    metadata: {
      description: '',
      badge: '',
      color: '#3B82F6',
    },
    isActive: true,
    isVisible: true,
    displayOrder: 1,
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getAllPlans();
      setPlans(data.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (error) {
      console.error('Failed to load plans:', error);
      alert('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscriptionService.createPlan(formData);
      alert('✅ Subscription plan created successfully!');
      setShowCreateModal(false);
      resetForm();
      loadPlans();
    } catch (error) {
      console.error('Failed to create plan:', error);
      alert('Failed to create plan');
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      await subscriptionService.updatePlan(editingPlan._id, formData);
      alert('✅ Subscription plan updated successfully!');
      setEditingPlan(null);
      resetForm();
      loadPlans();
    } catch (error) {
      console.error('Failed to update plan:', error);
      alert('Failed to update plan');
    }
  };

  const handleDeletePlan = async (id: string, planName: string) => {
    if (!confirm(`Are you sure you want to delete the "${planName}" plan? This cannot be undone.`)) {
      return;
    }

    try {
      await subscriptionService.deletePlan(id);
      alert('✅ Plan deleted successfully!');
      loadPlans();
    } catch (error: any) {
      alert(error.message || 'Failed to delete plan');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      await subscriptionService.togglePlanVisibility(id);
      loadPlans();
    } catch (error) {
      alert('Failed to toggle visibility');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await subscriptionService.togglePlanStatus(id);
      loadPlans();
    } catch (error) {
      alert('Failed to toggle status');
    }
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      tier: plan.tier,
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      features: { ...plan.features },
      metadata: { ...plan.metadata },
      isActive: plan.isActive,
      isVisible: plan.isVisible,
      displayOrder: plan.displayOrder,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tier: 'basic',
      price: 0,
      currency: 'USD',
      interval: 'month',
      features: {
        adsPerMonth: 0,
        listingDuration: 30,
        imagesPerAd: 5,
        maxImageSize: 5,
        isFeatured: false,
        hasAnalytics: false,
        hasPrioritySupport: false,
        hasPriorityPlacement: false,
        hasApiAccess: false,
        hasCustomBranding: false,
        allowedCategories: [],
      },
      metadata: {
        description: '',
        badge: '',
        color: '#3B82F6',
      },
      isActive: true,
      isVisible: true,
      displayOrder: 1,
    });
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.location.href = '/admin/dashboard'}
          className="mb-4 text-gray-600 hover:text-gray-800 flex items-center transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Subscription Plans</h1>
            <p className="text-gray-600 mt-1">Manage pricing plans and features</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Plan
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition"
            >
              {/* Plan Header */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{plan.tier} Tier</p>
                  </div>
                  {plan.metadata.badge && (
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                      {plan.metadata.badge}
                    </span>
                  )}
                </div>
                
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-800">
                    ${formatPrice(plan.price)}
                  </span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
                
                <p className="text-sm text-gray-600 mt-2">{plan.metadata.description}</p>
              </div>

              {/* Features */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {plan.features.adsPerMonth === 'unlimited' ? 'Unlimited' : plan.features.adsPerMonth} ads/month
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {plan.features.listingDuration}-day duration
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Up to {plan.features.imagesPerAd} images
                  </li>
                  {plan.features.isFeatured && (
                    <li className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Featured badge
                    </li>
                  )}
                  {plan.features.hasAnalytics && (
                    <li className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Analytics
                    </li>
                  )}
                  {plan.features.hasPrioritySupport && (
                    <li className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Priority support
                    </li>
                  )}
                </ul>

                {/* Status Badges */}
                <div className="mt-4 flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${plan.isVisible ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {plan.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 border-t grid grid-cols-2 gap-2">
                <button
                  onClick={() => openEditModal(plan)}
                  className="text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleVisibility(plan._id)}
                  className="text-sm bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition"
                >
                  {plan.isVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleToggleStatus(plan._id)}
                  className="text-sm bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 transition"
                >
                  {plan.isActive ? 'Deactivate' : 'Activate'}
                </button>
                {plan.tier !== 'free' && (
                  <button
                    onClick={() => handleDeletePlan(plan._id, plan.name)}
                    className="text-sm bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingPlan) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-3xl w-full my-8">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                </h2>
              </div>

              <form onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Plan Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tier <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (in cents) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">${formatPrice(formData.price)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Interval <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.interval}
                      onChange={(e) => setFormData({ ...formData, interval: e.target.value as any })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.metadata.description}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      metadata: { ...formData.metadata, description: e.target.value }
                    })}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Badge (optional)</label>
                    <input
                      type="text"
                      value={formData.metadata.badge}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        metadata: { ...formData.metadata, badge: e.target.value }
                      })}
                      placeholder="POPULAR, BEST VALUE, etc."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Plan Features</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ads Per Month</label>
                      <input
                        type="number"
                        value={formData.features.adsPerMonth === 'unlimited' ? -1 : formData.features.adsPerMonth}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setFormData({ 
                            ...formData, 
                            features: { 
                              ...formData.features, 
                              adsPerMonth: val === -1 ? 'unlimited' : val 
                            }
                          });
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Use -1 for unlimited</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Duration (days)</label>
                      <input
                        type="number"
                        value={formData.features.listingDuration}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          features: { ...formData.features, listingDuration: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Images Per Ad</label>
                      <input
                        type="number"
                        value={formData.features.imagesPerAd}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          features: { ...formData.features, imagesPerAd: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Max Image Size (MB)</label>
                      <input
                        type="number"
                        value={formData.features.maxImageSize}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          features: { ...formData.features, maxImageSize: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {[
                      { key: 'isFeatured', label: 'Featured Badge' },
                      { key: 'hasAnalytics', label: 'Analytics' },
                      { key: 'hasPrioritySupport', label: 'Priority Support' },
                      { key: 'hasPriorityPlacement', label: 'Priority Placement' },
                      { key: 'hasApiAccess', label: 'API Access' },
                      { key: 'hasCustomBranding', label: 'Custom Branding' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.features[key as keyof typeof formData.features] as boolean}
                          onChange={(e) => setFormData({
                            ...formData,
                            features: { ...formData.features, [key]: e.target.checked }
                          })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Visibility Toggles */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-semibold text-gray-700">Active</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isVisible}
                        onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-semibold text-gray-700">Visible on Pricing Page</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingPlan(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
