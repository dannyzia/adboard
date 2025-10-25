import { api } from './api';
import { Ad, AdFilters, PaginatedAdsResponse, CreateAdData } from '../types';
import { generateMockAds } from '../utils/mockData';

// Flag to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = false;

export const adService = {
  /**
   * Fetch ads with pagination and filters
   */
  async getAds(
    page: number = 1,
    limit: number = 24,
    filters?: AdFilters
  ): Promise<PaginatedAdsResponse> {
    // Use mock data for development
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Reduced delay for faster loading
      
      const startIndex = (page - 1) * limit;
      let allMockAds = generateMockAds(2400, 0); // Generate 2400 mock ads for infinite scroll
      
      // Apply filters
      if (filters?.category) {
        allMockAds = allMockAds.filter(ad => ad.category === filters.category);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        allMockAds = allMockAds.filter(ad => 
          ad.title.toLowerCase().includes(search) || 
          (ad.description || '').toLowerCase().includes(search)
        );
      }
      if (filters?.location?.country) {
        allMockAds = allMockAds.filter(ad => ad.location.country === filters.location?.country);
      }
      if (filters?.location?.state) {
        allMockAds = allMockAds.filter(ad => ad.location.state === filters.location?.state);
      }
      if (filters?.location?.city) {
        allMockAds = allMockAds.filter(ad => ad.location.city === filters.location?.city);
      }
      
      const ads = allMockAds.slice(startIndex, startIndex + limit);
      const totalAds = allMockAds.length;
      const totalPages = Math.ceil(totalAds / limit);
      
      return {
        ads,
        page,
        totalPages,
        totalAds,
        hasMore: page < totalPages,
      };
    }
    
    // Real API call
    const params: any = { page, limit };
    
    if (filters?.category) params.category = filters.category;
    if (filters?.search) params.search = filters.search;
    if (filters?.location?.country) params.country = filters.location.country;
    if (filters?.location?.state) params.state = filters.location.state;
    if (filters?.location?.city) params.city = filters.location.city;
    if (filters?.priceMin !== undefined) params.priceMin = filters.priceMin;
    if (filters?.priceMax !== undefined) params.priceMax = filters.priceMax;

    try {
      const response = await api.get<{
        success: boolean;
        ads: Ad[];
        pagination: {
          total: number;
          page: number;
          pages: number;
          limit: number;
        };
      }>('/ads', { params });
      
      // Transform backend response to match expected format
      return {
        ads: response.data.ads,
        page: response.data.pagination.page,
        totalPages: response.data.pagination.pages,
        totalAds: response.data.pagination.total,
        hasMore: response.data.pagination.page < response.data.pagination.pages,
      };
    } catch (error: any) {
      // If rate limited (429), wait and retry once
      if (error.response?.status === 429) {
        console.warn('Rate limited, retrying ads fetch in 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const retryResponse = await api.get<{
          success: boolean;
          ads: Ad[];
          pagination: {
            total: number;
            page: number;
            pages: number;
            limit: number;
          };
        }>('/ads', { params });
        
        return {
          ads: retryResponse.data.ads,
          page: retryResponse.data.pagination.page,
          totalPages: retryResponse.data.pagination.pages,
          totalAds: retryResponse.data.pagination.total,
          hasMore: retryResponse.data.pagination.page < retryResponse.data.pagination.pages,
        };
      }
      throw error;
    }
  },

  /**
   * Get a single ad by ID
   */
  async getAdById(id: string): Promise<Ad> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = parseInt(id.split('-')[1]) || 0;
      return generateMockAds(1, index)[0];
    }
    
    const response = await api.get<{success: boolean; ad: Ad}>(`/ads/${id}`);
    return response.data.ad;
  },

  /**
   * Create a new ad
   */
  async createAd(data: CreateAdData): Promise<Ad> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAd: Ad = {
        _id: `ad-${Date.now()}`,
        ...data,
        userId: 'mock-user-1',
        views: 0,
        isFeatured: false,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      };
      
      return newAd;
    }
    
    const response = await api.post<Ad>('/ads', data);
    return response.data;
  },

  /**
   * Update an existing ad
   */
  async updateAd(id: string, data: Partial<CreateAdData>): Promise<Ad> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In mock mode, just return the updated ad
      const updatedAd: Ad = {
        _id: id,
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'Jobs',
        price: data.price,
        currency: data.currency,
        images: data.images || [],
        location: data.location || { country: '', state: '', city: '' },
        links: data.links,
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        userId: 'mock-user-1',
        views: 0,
        isFeatured: false,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      return updatedAd;
    }
    
    const response = await api.put<Ad>(`/ads/${id}`, data);
    return response.data;
  },

  /**
   * Delete an ad
   */
  async deleteAd(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // In mock mode, just simulate deletion
      return;
    }
    
    await api.delete(`/ads/${id}`);
  },

  /**
   * Get similar ads
   */
  async getSimilarAds(
    adId: string,
    category: string,
    location: { country: string; state: string; city: string },
    limit: number = 3
  ): Promise<Ad[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Generate and filter similar ads
      const allAds = generateMockAds(100, 0);
      const similar = allAds
        .filter(ad => 
          ad._id !== adId && // Exclude current ad
          ad.category === category && // Same category
          (ad.location.state === location.state || ad.location.country === location.country) // Same location
        )
        .slice(0, limit);
      
      return similar;
    }
    
    const params: any = { category, exclude: adId, limit };
    if (location.city) params.city = location.city;
    if (location.state) params.state = location.state;
    if (location.country) params.country = location.country;
    
    const response = await api.get<{success: boolean; ads: Ad[]}>('/ads/similar', { params });
    return response.data.ads;
  },

  /**
   * Get user's ads
   */
  async getMyAds(): Promise<Ad[]> {
    const response = await api.get<Ad[]>('/ads/my-ads');
    return response.data;
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(adId: string): Promise<void> {
    await api.post(`/ads/${adId}/favorite`);
  },

  /**
   * Get user's favorite ads
   */
  async getFavorites(): Promise<Ad[]> {
    const response = await api.get<Ad[]>('/ads/favorites');
    return response.data;
  },
};
