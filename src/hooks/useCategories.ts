import { useState, useEffect } from 'react';
import { categoryService, Category } from '../services/category.service';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch from API
        const data = await categoryService.getCategories();
        setCategories(data);
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
