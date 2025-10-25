import { useState, useCallback, useRef } from 'react';
import { Ad, AdFilters, PaginatedAdsResponse } from '../types';
import { adService } from '../services/ad.service';
import { ADS_PER_PAGE } from '../utils/constants';

export const useAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalAds, setTotalAds] = useState(0);
  const pageRef = useRef(1);

  const fetchAds = useCallback(
    async (filters?: AdFilters, resetPage: boolean = false) => {
      setLoading(true);
      setError(null);
      
      try {
        const currentPage = resetPage ? 1 : pageRef.current;
        
        const response: PaginatedAdsResponse = await adService.getAds(
          currentPage,
          ADS_PER_PAGE,
          filters
        );

        if (resetPage) {
          setAds(response.ads);
          pageRef.current = 2;
        } else {
          setAds((prev) => [...prev, ...response.ads]);
          pageRef.current = pageRef.current + 1;
        }

        setHasMore(response.hasMore);
        setTotalAds(response.totalAds);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch ads');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadMore = useCallback((filters?: AdFilters) => {
    if (!loading && hasMore) {
      fetchAds(filters, false);
    }
  }, [loading, hasMore, fetchAds]);

  const reset = useCallback(() => {
    setAds([]);
    pageRef.current = 1;
    setHasMore(true);
    setError(null);
  }, []);

  return {
    ads,
    loading,
    error,
    hasMore,
    totalAds,
    fetchAds,
    loadMore,
    reset,
  };
};
