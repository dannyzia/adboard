import { api } from './api';

export interface Category {
  value: string;
  label: string;
  color: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

class CategoryService {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<CategoriesResponse>('/categories');
      return response.data.categories;
    } catch (error: any) {
      // If rate limited (429), wait and retry once
      if (error.response?.status === 429) {
        console.warn('Rate limited, retrying categories fetch in 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const retryResponse = await api.get<CategoriesResponse>('/categories');
        return retryResponse.data.categories;
      }
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
