import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HamburgerMenu } from './HamburgerMenu';
import { COUNTRIES, STATES, CITIES } from '../../utils/constants';
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

  const availableStates = STATES[country] || [];
  const availableCities = CITIES[state] || [];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <h1
            className="text-xl font-bold text-blue-600 cursor-pointer whitespace-nowrap"
            onClick={() => navigate('/')}
          >
            AdBoard
          </h1>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Country Dropdown */}
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setState('');
              setCity('');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* State Dropdown */}
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setCity('');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[110px]"
            disabled={!country}
          >
            <option value="">Select State</option>
            {availableStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* City Dropdown */}
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[110px]"
            disabled={!state}
          >
            <option value="">Select City</option>
            {availableCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Hamburger Menu */}
          <HamburgerMenu />

          {/* Post Ad Button */}
          <button
            onClick={() => navigate('/post-ad')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm whitespace-nowrap"
          >
            Post Ad
          </button>
        </div>
      </div>
    </nav>
  );
};
