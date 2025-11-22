import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HamburgerMenu } from './HamburgerMenu';
import { getCountries, getStates, getCities } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';
import { useCategories } from '../../hooks/useCategories';

interface NavbarProps {
  onFilterChange?: (filters: any) => void;
  transparent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onFilterChange, transparent = false }) => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [countriesList, setCountriesList] = useState<string[]>([]);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Use ref to store the callback to avoid infinite loops
  const onFilterChangeRef = React.useRef(onFilterChange);
  
  React.useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (transparent) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [transparent]);

  React.useEffect(() => {
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current({
        search: debouncedSearch,
        category: category || undefined,
        location: {
          country: country || undefined,
          state: state || undefined,
          city: city || undefined,
        },
      });
    }
    
    // Scroll to Browse All Ads section when filters change
    if (category || country || state || city) {
      setTimeout(() => {
        const el = document.getElementById('browse-ads');
        if (el) {
          const yOffset = -100; // Offset to show filters above
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [debouncedSearch, category, country, state, city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({
        search: searchQuery,
        category: category || undefined,
        location: { country, state, city },
      });
    }
  };

  const availableStates = statesList;
  const availableCities = citiesList;

  useEffect(() => {
    // fetch countries on mount
    let mounted = true;
    Promise.resolve(getCountries()).then((c) => {
      if (mounted && Array.isArray(c)) {
        const sorted = (c as string[]).sort((a, b) => a.localeCompare(b));
        setCountriesList(sorted);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // when country changes, fetch states
    let mounted = true;
    if (!country) {
      setStatesList([]);
      setCitiesList([]);
      return;
    }
    Promise.resolve(getStates(country)).then((s) => {
      if (mounted) setStatesList(s as string[]);
    }).catch(() => setStatesList([]));
    return () => { mounted = false; };
  }, [country]);

  useEffect(() => {
    let mounted = true;
    if (!state) {
      setCitiesList([]);
      return;
    }
    Promise.resolve(getCities(state)).then((c) => {
      if (mounted) setCitiesList(c as string[]);
    }).catch(() => setCitiesList([]));
    return () => { mounted = false; };
  }, [state]);

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const navClasses = transparent
    ? `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'shadow-sm'
          : 'bg-transparent'
      }`
    : 'shadow-sm sticky top-0 z-40';

  const navStyle = transparent && isScrolled
    ? {
        background: 'transparent',
        backdropFilter: 'none',
      }
    : !transparent
    ? {
        background: 'transparent',
        backdropFilter: 'none',
      }
    : {};

  return (
    <nav className={navClasses} style={navStyle}>
      {/* Desktop/Tablet Navbar - hidden on mobile */}
      <div className="hidden md:block max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer hover:scale-105 transition-transform duration-300 flex-shrink-0"
            onClick={() => navigate('/')}
          >
            <img
              src="/adboard resources/Image/logo_bg_removed.webp"
              alt="ListyNest Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="flex-1"
            style={{ maxWidth: '500px' }}
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 group-focus-within:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 text-gray-900 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all placeholder:text-gray-400 border-0"
              />
              <button
                type="button"
                onClick={() => {
                  if (searchQuery.trim()) {
                    handleSearch({ preventDefault: () => {} } as any);
                  }
                }}
                className="absolute inset-y-0 right-0 flex items-center px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-r-xl transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 text-sm text-gray-700 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white min-w-[140px] transition-all border-0 cursor-pointer"
            >
              <option value="" className="bg-white text-gray-900">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-white text-gray-900">
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setState('');
                setCity('');
              }}
              className="px-4 py-2.5 text-sm text-gray-700 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white min-w-[110px] transition-all border-0 cursor-pointer"
            >
              <option value="" className="bg-white text-gray-900">Country</option>
              {countriesList.map((c) => (
                <option key={c} value={c} className="bg-white text-gray-900">
                  {c}
                </option>
              ))}
            </select>

            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity('');
              }}
              className="px-4 py-2.5 text-sm text-gray-700 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white min-w-[110px] transition-all disabled:opacity-40 disabled:cursor-not-allowed border-0 cursor-pointer"
              disabled={!country}
            >
              <option value="" className="bg-white text-gray-900">State</option>
              {availableStates.map((s) => (
                <option key={s} value={s} className="bg-white text-gray-900">
                  {s}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-2.5 text-sm text-gray-700 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white min-w-[110px] transition-all disabled:opacity-40 disabled:cursor-not-allowed border-0 cursor-pointer"
              disabled={!state}
            >
              <option value="" className="bg-white text-gray-900">City</option>
              {availableCities.map((c) => (
                <option key={c} value={c} className="bg-white text-gray-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Hamburger Menu */}
          <HamburgerMenu />

          {/* Post Ad Button */}
          <button
            onClick={() => navigate('/post-ad')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl transition-all font-semibold whitespace-nowrap border-0"
          >
            Post Ad
          </button>
        </div>
      </div>

      {/* Mobile bottom navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          {/* Search overlay */}
          {showMobileSearch && (
            <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-xl">
              <form onSubmit={(e) => { handleSearch(e); setShowMobileSearch(false); }} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 border-2 border-gray-200"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition"
                >
                  Go
                </button>
              </form>
            </div>
          )}


          {/* Bottom nav buttons */}
          <div className="flex items-center justify-around py-3 px-4">
            {/* Home */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center text-gray-600 hover:text-teal-500 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>

            {/* Search */}
            <button
              onClick={() => { setShowMobileSearch(!showMobileSearch); setShowMobileFilters(false); }}
              className="flex items-center justify-center text-gray-600 hover:text-teal-500 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Filter */}
            <button
              onClick={() => { setShowMobileFilters(!showMobileFilters); setShowMobileSearch(false); }}
              className="flex items-center justify-center text-gray-600 hover:text-teal-500 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>

            {/* Post */}
            <button
              onClick={() => navigate('/post-ad')}
              className="flex items-center justify-center text-gray-600 hover:text-teal-500 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Menu */}
            <div className="flex items-center justify-center">
              <HamburgerMenu />
            </div>
          </div>
        </div>
      </nav>
  );
};
