import { useState, useEffect } from 'react';
import { categoryService, Category } from '../services/category.service';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Check if categories are cached in sessionStorage (with 5 minute expiry)
        const cached = sessionStorage.getItem('categories');
        const cacheTimestamp = sessionStorage.getItem('categories_timestamp');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (cached && cacheTimestamp && (now - parseInt(cacheTimestamp)) < fiveMinutes) {
          setCategories(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // Fetch from API
        const data = await categoryService.getCategories();
        setCategories(data);

        // Cache in sessionStorage with timestamp
        sessionStorage.setItem('categories', JSON.stringify(data));
        sessionStorage.setItem('categories_timestamp', now.toString());
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
