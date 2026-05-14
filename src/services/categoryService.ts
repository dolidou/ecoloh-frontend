import api from './api';

export interface Category {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  visible?: boolean;
}

export interface CategoryFormData {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  image_url?: string;
  visible?: boolean;
}

const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.data || [];
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/categories/${slug}`);
    return response.data.data;
  },

  create: async (data: CategoryFormData): Promise<Category> => {
    const response = await api.post('/admin/categories', data);
    return response.data.data;
  },

  update: async (slug: string, data: Partial<CategoryFormData>): Promise<Category> => {
    const response = await api.put(`/admin/categories/${slug}`, data);
    return response.data.data;
  },

  delete: async (slug: string): Promise<void> => {
    await api.delete(`/admin/categories/${slug}`);
  },
};

export default categoryService;
