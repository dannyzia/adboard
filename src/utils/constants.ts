import { CategoryType } from '../types';
import locationService from '../services/location.service';

// Categories will be fetched from backend via categoryService
// These are fallbacks for TypeScript type checking
export const CATEGORY_COLORS: Record<string, string> = {};

export const CATEGORIES: CategoryType[] = [];

// Helper to convert backend category to Tailwind class
// Use explicit class names so Tailwind can detect them at build time
export const getCategoryColor = (_category: string, color: string): string => {
  const colorMap: Record<string, string> = {
    'blue': 'bg-blue-600',
    'indigo': 'bg-indigo-600',
    'orange': 'bg-orange-600',
    'cyan': 'bg-cyan-600',
    'purple': 'bg-purple-600',
    'pink': 'bg-pink-600',
    'green': 'bg-green-600',
    'red': 'bg-red-600',
    'yellow': 'bg-yellow-600',
    'amber': 'bg-amber-600',
    'lime': 'bg-lime-600',
    'sky': 'bg-sky-600',
    'emerald': 'bg-emerald-600',
    'violet': 'bg-violet-600',
    'rose': 'bg-rose-600',
    'fuchsia': 'bg-fuchsia-600',
    'slate': 'bg-slate-600',
    'teal': 'bg-teal-600',
    'gray': 'bg-gray-600',
  };

  return colorMap[color] || 'bg-gray-600';
};

// Location data is now fetched from the backend API
// These are fallback values for development/testing
export const COUNTRIES: string[] = [];
export const STATES: Record<string, string[]> = {};
export const CITIES: Record<string, string[]> = {};

// Cache for location data to avoid repeated API calls
let locationCache: {
  countries: string[];
  states: Record<string, string[]>;
  cities: Record<string, string[]>;
  lastFetched: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get countries from API with caching
 */
export const getCountries = async (): Promise<string[]> => {
  const now = Date.now();

  if (locationCache && (now - locationCache.lastFetched) < CACHE_DURATION) {
    return locationCache.countries;
  }

  try {
    const countries = await locationService.getCountries();
    locationCache = {
      countries,
      states: locationCache?.states || {},
      cities: locationCache?.cities || {},
      lastFetched: now,
    };
    return countries;
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return COUNTRIES; // Return empty array as fallback
  }
};

/**
 * Get states for a country from API with caching
 */
export const getStates = async (country: string): Promise<string[]> => {
  const now = Date.now();

  if (locationCache && (now - locationCache.lastFetched) < CACHE_DURATION) {
    return locationCache.states[country] || [];
  }

  try {
    const states = await locationService.getStates(country);
    if (locationCache) {
      locationCache.states[country] = states;
    } else {
      locationCache = {
        countries: [],
        states: { [country]: states },
        cities: {},
        lastFetched: now,
      };
    }
    return states;
  } catch (error) {
    console.error('Failed to fetch states:', error);
    return STATES[country] || []; // Return empty array as fallback
  }
};

/**
 * Get cities for a state from API with caching
 */
export const getCities = async (state: string): Promise<string[]> => {
  const now = Date.now();

  if (locationCache && (now - locationCache.lastFetched) < CACHE_DURATION) {
    return locationCache.cities[state] || [];
  }

  try {
    const cities = await locationService.getCities(state);
    if (locationCache) {
      locationCache.cities[state] = cities;
    } else {
      locationCache = {
        countries: [],
        states: {},
        cities: { [state]: cities },
        lastFetched: now,
      };
    }
    return cities;
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return CITIES[state] || []; // Return empty array as fallback
  }
};

/**
 * Clear location cache (useful for testing or when data changes)
 */
export const clearLocationCache = (): void => {
  locationCache = null;
};

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee' },
];

export const ADS_PER_PAGE = 48;

export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const ROUTES = {
  HOME: '/',
  AD_DETAIL: '/ad/:id',
  POST_AD: '/post-ad',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  PRICING: '/pricing',
} as const;
