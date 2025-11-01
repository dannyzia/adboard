const { COUNTRIES, STATES, CITIES } = require('../config/locations.config');

/**
 * Location Service
 * Handles business logic for location data
 */
class LocationService {
  /**
   * Get all countries
   * @returns {string[]} Array of country names
   */
  getCountries() {
    return COUNTRIES;
  }

  /**
   * Get states/provinces for a specific country
   * @param {string} country - The country name
   * @returns {string[]} Array of state/province names
   */
  getStates(country) {
    if (!country || !STATES[country]) {
      return [];
    }
    return STATES[country];
  }

  /**
   * Get cities for a specific state/province
   * @param {string} state - The state/province name
   * @returns {string[]} Array of city names
   */
  getCities(state) {
    if (!state || !CITIES[state]) {
      return [];
    }
    return CITIES[state];
  }

  /**
   * Get all location data
   * @returns {Object} Object containing countries, states, and cities
   */
  getAllLocations() {
    return {
      countries: COUNTRIES,
      states: STATES,
      cities: CITIES,
    };
  }

  /**
   * Check if a country exists
   * @param {string} country - The country name
   * @returns {boolean} True if country exists
   */
  countryExists(country) {
    return COUNTRIES.includes(country);
  }

  /**
   * Check if a state exists for a given country
   * @param {string} country - The country name
   * @param {string} state - The state name
   * @returns {boolean} True if state exists for the country
   */
  stateExists(country, state) {
    const countryStates = this.getStates(country);
    return countryStates.includes(state);
  }

  /**
   * Check if a city exists for a given state
   * @param {string} state - The state name
   * @param {string} city - The city name
   * @returns {boolean} True if city exists for the state
   */
  cityExists(state, city) {
    const stateCities = this.getCities(state);
    return stateCities.includes(city);
  }

  /**
   * Validate a complete location (country, state, city)
   * @param {string} country - The country name
   * @param {string} state - The state name
   * @param {string} city - The city name
   * @returns {Object} Validation result with isValid boolean and error message if invalid
   */
  validateLocation(country, state, city) {
    if (!this.countryExists(country)) {
      return { isValid: false, error: 'Invalid country' };
    }

    if (!this.stateExists(country, state)) {
      return { isValid: false, error: 'Invalid state for the selected country' };
    }

    if (!this.cityExists(state, city)) {
      return { isValid: false, error: 'Invalid city for the selected state' };
    }

    return { isValid: true };
  }
}

module.exports = new LocationService();