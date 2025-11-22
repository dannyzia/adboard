// Location configuration - comprehensive data from combined_sanitized_final.json
const locationsData = require('./locations-data.json');

// Build COUNTRIES array - keep as simple string array for backward compatibility with service
const COUNTRIES = locationsData.map(country => country.country);

// Build STATES object mapping country -> states array
const STATES = {};
locationsData.forEach(country => {
  STATES[country.country] = country.states.map(state => state.name);
});

// Build CITIES object mapping state -> cities array
const CITIES = {};
locationsData.forEach(country => {
  country.states.forEach(state => {
    CITIES[state.name] = state.cities;
  });
});

// Helper to get country names only
function getCountryNames() {
  return locationsData.map(c => c.country);
}

// Helper to get currency code for a country
function getCurrencyForCountry(countryName) {
  const country = locationsData.find(c => c.country === countryName);
  return country ? country.currencyCode : null;
}

// Helper to get currency name for a country
function getCurrencyNameForCountry(countryName) {
  const country = locationsData.find(c => c.country === countryName);
  return country ? country.currencyName : null;
}

// Helper to get all states for a country
function getStatesForCountry(countryName) {
  return STATES[countryName] || [];
}

// Helper to get all cities for a state
function getCitiesForState(stateName) {
  return CITIES[stateName] || [];
}

// Helper to validate a location
function validateLocation(country, state, city) {
  // Check if country exists
  if (!STATES[country]) {
    return { valid: false, message: 'Invalid country' };
  }

  // Check if state exists in country
  if (state && !STATES[country].includes(state)) {
    return { valid: false, message: 'Invalid state for this country' };
  }

  // Check if city exists in state
  if (city && state && !CITIES[state]?.includes(city)) {
    return { valid: false, message: 'Invalid city for this state' };
  }

  return { valid: true };
}

module.exports = {
  COUNTRIES,
  STATES,
  CITIES,
  getCountryNames,
  getCurrencyForCountry,
  getCurrencyNameForCountry,
  getStatesForCountry,
  getCitiesForState,
  validateLocation,
  // Export raw data for advanced use cases
  locationsData
};
