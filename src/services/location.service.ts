import { api } from './api';

/**
 * Location Service
 * Handles fetching location data from the backend API
 */
class LocationService {
  /**
   * Get all countries
   * @returns {Promise<string[]>} Array of country names
   */
  async getCountries(): Promise<string[]> {
    try {
      const response = await api.get('/locations/countries');
      const payload = response.data.data || [];
      // Return normalized array of country objects: { name, slug, currencyCode }
      if (Array.isArray(payload)) {
        return payload.map((p: any) => {
          if (typeof p === 'string') return { name: p } as any;
          return {
            name: p.name || p.country || '',
            slug: p.slug || p.code || undefined,
            currencyCode: p.currencyCode || p.currency || undefined
          };
        }).filter((c: any) => c.name);
      }
      return [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Fallback to empty array
      return [];
    }
  }

  /**
   * Get states/provinces for a specific country
   * @param {string} country - The country name
   * @returns {Promise<string[]>} Array of state/province names
   */
  async getStates(country: string): Promise<string[]> {
    try {
      const response = await api.get(`/locations/states/${encodeURIComponent(country)}`);
      const payload = response.data.data || [];
      // Normalize: backend may return [{ name, slug }, ...]
      if (Array.isArray(payload) && payload.length > 0 && typeof payload[0] === 'object') {
        return payload.map((p: any) => p.name || '').filter(Boolean);
      }
      return payload;
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  }

  /**
   * Get cities for a specific state/province
   * @param {string} state - The state/province name
   * @returns {Promise<string[]>} Array of city names
   */
  async getCities(state: string): Promise<string[]> {
    try {
      const response = await api.get(`/locations/cities/${encodeURIComponent(state)}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  /**
   * Validate a location
   * @param {string} country - The country name
   * @param {string} state - The state name
   * @param {string} city - The city name
   * @returns {Promise<Object>} Validation result
   */
  async validateLocation(country: string, state: string, city: string): Promise<{ success: boolean; isValid?: boolean; error?: string }> {
    try {
      const response = await api.post('/locations/validate', { country, state, city });
      return response.data;
    } catch (error) {
      console.error('Error validating location:', error);
      return { success: false, error: 'Validation failed' };
    }
  }
}

export default new LocationService();