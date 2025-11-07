import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HamburgerMenu } from './HamburgerMenu';
import { getCountries, getStates, getCities } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';
import { useCategories } from '../../hooks/useCategories';

interface NavbarProps {
  onFilterChange?: (filters: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onFilterChange }) => {
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

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Use ref to store the callback to avoid infinite loops
  const onFilterChangeRef = React.useRef(onFilterChange);
  
  React.useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

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
      if (mounted && Array.isArray(c)) setCountriesList(c as string[]);
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

  return (
    <nav className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 shadow-md sticky top-0 z-40">
      {/* Desktop/Tablet Navbar - hidden on mobile */}
      <div className="hidden md:block max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap">
          {/* Logo */}
          <h1
            className="order-1 text-2xl font-bold text-white cursor-pointer whitespace-nowrap flex-shrink-0 drop-shadow-lg"
            onClick={() => navigate('/')}
          >
            🏪 AdBoard
          </h1>

          {/* Search Box - Much Wider */}
          <form
            onSubmit={handleSearch}
            className="order-3 xl:order-2 w-full xl:flex-1 xl:basis-0"
            style={{ maxWidth: '1200px' }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-8 py-3 rounded-full text-gray-900 text-base focus:outline-none focus:ring-4 focus:ring-teal-500/30 shadow-lg border-2 border-gray-100"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full transition shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="order-4 xl:order-3 w-full grid grid-cols-2 gap-3 sm:grid-cols-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent xl:min-w-[140px]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
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
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent xl:min-w-[120px]"
            >
              <option value="">Country</option>
              {countriesList.map((c) => (
                <option key={c} value={c}>
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
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent xl:min-w-[110px]"
              disabled={!country}
            >
              <option value="">State</option>
              {availableStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent xl:min-w-[110px]"
              disabled={!state}
            >
              <option value="">City</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="order-2 xl:order-4 w-full xl:w-auto flex items-center gap-3 justify-end xl:justify-start xl:ml-auto">
            <HamburgerMenu />
            <button
              onClick={() => navigate('/post-ad')}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-lg transition font-semibold whitespace-nowrap shadow-md hover:shadow-lg transform hover:scale-105"
            >
              + Post Ad
            </button>
          </div>
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

        {/* Filters overlay */}
        {showMobileFilters && (
          <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-xl">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-xs border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={country}
                onChange={(e) => { setCountry(e.target.value); setState(''); setCity(''); }}
                className="px-3 py-2 text-xs border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Country</option>
                {countriesList.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>

              <select
                value={state}
                onChange={(e) => { setState(e.target.value); setCity(''); }}
                className="px-3 py-2 text-xs border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!country}
              >
                <option value="">State</option>
                {availableStates.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-3 py-2 text-xs border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!state}
              >
                <option value="">City</option>
                {availableCities.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-2 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 transition"
            >
              Apply Filters
            </button>
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
