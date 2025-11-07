const fs = require('fs');
const path = require('path');

// Fallback static config (kept for backwards compatibility)
const { COUNTRIES, STATES, CITIES } = require('../config/locations.config');

/**
 * Simple slugify for lookup keys
 */
function slugify(value) {
  if (!value || typeof value !== 'string') return '';
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

class LocationService {
  constructor() {
    this.source = 'static';
    this.countries = []; // array of country objects from file or static
    this.countryBySlug = new Map();
    this.countryByNameLower = new Map();

    // Try to load canonical combined JSON if present
    const candidate = path.resolve(__dirname, '..', '..', 'adboard_instructions', 'Countries Data', 'json', 'combined_sanitized_final.json');
    if (fs.existsSync(candidate)) {
      try {
        const raw = fs.readFileSync(candidate, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.source = 'file';
          this._loadFromParsed(parsed);
        }
      } catch (err) {
        console.error('Failed to load combined_sanitized_final.json, falling back to static config:', err.message);
        this._loadFromStatic();
      }
    } else {
      this._loadFromStatic();
    }
  }

  _loadFromParsed(parsed) {
    this.countries = parsed.map((c) => {
      const countryName = c.country || c.name || '';
      const slug = slugify(countryName);
      const currencyCode = c.currencyCode || c.currency || null;
      const currencyName = c.currencyName || null;
      const states = Array.isArray(c.states)
        ? c.states.map((s) => ({ name: s.name || s.state || '', slug: slugify(s.name || s.state || ''), cities: Array.isArray(s.cities) ? s.cities : [] }))
        : [];

      const obj = { name: countryName, slug, currencyCode, currencyName, states };
      this.countryBySlug.set(slug, obj);
      this.countryByNameLower.set(countryName.toLowerCase(), obj);
      return obj;
    });
  }

  _loadFromStatic() {
    this.source = 'static';
    // Build countries array from static lists
    this.countries = COUNTRIES.map((name) => ({ name, slug: slugify(name) }));
    this.countries.forEach((c) => {
      this.countryBySlug.set(c.slug, c);
      this.countryByNameLower.set(c.name.toLowerCase(), c);
    });
    // Note: STATES and CITIES remain available via fallback getters below
  }

  /**
   * Return minimal country list (name + slug + optional currencyCode)
   */
  getCountries() {
    return this.countries.map((c) => ({ name: c.name, slug: c.slug, currencyCode: c.currencyCode || null }));
  }

  /**
   * Resolve a country object by slug or name (case-insensitive)
   */
  _resolveCountry(identifier) {
    if (!identifier) return null;
    const bySlug = this.countryBySlug.get(slugify(identifier));
    if (bySlug) return bySlug;
    const byName = this.countryByNameLower.get(identifier.toLowerCase());
    if (byName) return byName;
    return null;
  }

  /**
   * Get states/provinces for a specific country (accepts slug or name)
   * @returns Array of { name, slug }
   */
  getStates(countryIdentifier) {
    const country = this._resolveCountry(countryIdentifier);
    if (country) {
      if (country.states) {
        return country.states.map((s) => ({ name: s.name, slug: s.slug }));
      }
      // If loaded from static fallback, use STATES map
      if (this.source === 'static' && STATES && STATES[country.name]) {
        return STATES[country.name].map((s) => ({ name: s, slug: slugify(s) }));
      }
    }
    return [];
  }

  /**
   * Get cities for a specific state/province.
   * Accepts either a state identifier (slug or name) or will search within a country when provided as object
   */
  getCities(stateIdentifier) {
    if (!stateIdentifier) return [];

    // First try to find by scanning countries -> states (when loaded from file)
    if (this.source === 'file') {
      const stateSlug = slugify(stateIdentifier);
      for (const country of this.countries) {
        const found = country.states.find((s) => s.slug === stateSlug || s.name.toLowerCase() === stateIdentifier.toLowerCase());
        if (found) return found.cities || [];
      }
    }

    // Fallback to static CITIES map (state name keys)
    if (CITIES && CITIES[stateIdentifier]) return CITIES[stateIdentifier];
    // try case-insensitive match in CITIES
    if (CITIES) {
      const key = Object.keys(CITIES).find((k) => k.toLowerCase() === stateIdentifier.toLowerCase());
      if (key) return CITIES[key];
    }

    return [];
  }

  getAllLocations() {
    if (this.source === 'file') {
      return this.countries;
    }
    // fallback structure similar to original
    return {
      countries: COUNTRIES,
      states: STATES,
      cities: CITIES,
    };
  }

  countryExists(countryIdentifier) {
    return !!this._resolveCountry(countryIdentifier);
  }

  stateExists(countryIdentifier, stateIdentifier) {
    const states = this.getStates(countryIdentifier);
    return states.some((s) => s.name.toLowerCase() === (stateIdentifier || '').toLowerCase() || s.slug === slugify(stateIdentifier));
  }

  cityExists(stateIdentifier, city) {
    const cities = this.getCities(stateIdentifier);
    return cities.some((c) => c.toLowerCase() === (city || '').toLowerCase());
  }

  validateLocation(countryIdentifier, stateIdentifier, city) {
    if (!this.countryExists(countryIdentifier)) {
      return { isValid: false, error: 'Invalid country' };
    }

    if (!this.stateExists(countryIdentifier, stateIdentifier)) {
      return { isValid: false, error: 'Invalid state for the selected country' };
    }

    if (!this.cityExists(stateIdentifier, city)) {
      return { isValid: false, error: 'Invalid city for the selected state' };
    }

    return { isValid: true };
  }
}

module.exports = new LocationService();