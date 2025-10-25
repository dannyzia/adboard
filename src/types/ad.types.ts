// Category type is now dynamic - fetched from backend
export type CategoryType = string;

export interface Location {
  country: string;
  state: string;
  city: string;
}

export interface AdImage {
  url: string;
  publicId?: string;
  order?: number;
}

export interface Ad {
  _id: string;
  title: string;
  description: string;
  category: CategoryType;
  price?: number;
  currency?: string;
  images: (string | AdImage)[];
  location: Location;
  links?: {
    link1?: string;
    link2?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  userId?: string; // For compatibility
  user?: {
    _id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  views: number;
  isFeatured: boolean;
  status: 'active' | 'expired' | 'draft' | 'archived' | 'deleted';
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  expiryDate?: string; // Expiration date (30 days from creation)
  // Archive fields
  archivedAt?: string;
  archivedBy?: string;
  archivedReason?: string;
  deletedAt?: string;
  deletedBy?: string;
  deletionReason?: string;
  legalHold?: boolean;
  retentionUntil?: string;
}

export interface AdFilters {
  category?: CategoryType;
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  search?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface PaginatedAdsResponse {
  ads: Ad[];
  page: number;
  totalPages: number;
  totalAds: number;
  hasMore: boolean;
}

export interface CreateAdData {
  title: string;
  description: string;
  category: CategoryType;
  price?: number;
  currency?: string;
  images: (string | { url: string; publicId?: string; order?: number })[];
  location: Location;
  links?: {
    link1?: string;
    link2?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  customDuration?: number; // Optional: user-selected ad duration in days
}
