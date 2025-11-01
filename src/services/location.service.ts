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
      return response.data.data || [];
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
      return response.data.data || [];
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