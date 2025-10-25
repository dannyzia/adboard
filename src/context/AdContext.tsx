import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Ad, AdFilters } from '../types';
import { adService } from '../services/ad.service';

interface AdContextType {
  selectedAd: Ad | null;
  filters: AdFilters;
  setFilters: (filters: AdFilters) => void;
  fetchAdById: (id: string) => Promise<void>;
  clearSelectedAd: () => void;
  loading: boolean;
  error: string | null;
}

export const AdContext = createContext<AdContextType | undefined>(undefined);

interface AdProviderProps {
  children: ReactNode;
}

export const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [filters, setFilters] = useState<AdFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const ad = await adService.getAdById(id);
      setSelectedAd(ad);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch ad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelectedAd = useCallback(() => {
    setSelectedAd(null);
  }, []);

  const value: AdContextType = {
    selectedAd,
    filters,
    setFilters,
    fetchAdById,
    clearSelectedAd,
    loading,
    error,
  };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
};
