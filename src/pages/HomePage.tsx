import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { AdGrid } from '../components/ads/AdGrid';
import { LoadingSpinner } from '../components/layout/LoadingSpinner';
import { useAds } from '../hooks/useAds';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { AdFilters } from '../types';

export const HomePage: React.FC = () => {
  const { ads, loading, hasMore, fetchAds, loadMore } = useAds();
  const [filters, setFilters] = useState<AdFilters>({});
  const filtersRef = React.useRef<AdFilters>({});
  const initialLoadDone = React.useRef(false);

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchAds(filters, true);
    }
  }, []);

  const handleFilterChange = (newFilters: AdFilters) => {
    setFilters(newFilters);
    filtersRef.current = newFilters;
    fetchAds(newFilters, true);
  };

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMore(filtersRef.current);
    }
  }, [loading, hasMore, loadMore]);

  // Enable infinite scroll
  useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: handleLoadMore,
    threshold: 500,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onFilterChange={handleFilterChange} />
      
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">{ads.length} ads found</span>
        </div>
        
        <AdGrid ads={ads} />

        {loading && <LoadingSpinner />}

        {!loading && ads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No ads found matching your criteria</p>
            <button
              onClick={() => {
                setFilters({});
                fetchAds({}, true);
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
