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
    const response = await api.get<CategoriesResponse>('/categories');
    return response.data.categories;
  }
}

export const categoryService = new CategoryService();
