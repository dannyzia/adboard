export interface SubscriptionPlan {
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
  
  createdAt: string;
  updatedAt: string;
  createdBy: string; // Admin user ID
}

export interface CreateSubscriptionPlanData {
  name: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: SubscriptionPlan['features'];
  metadata: SubscriptionPlan['metadata'];
  isActive: boolean;
  isVisible: boolean;
  displayOrder: number;
}
