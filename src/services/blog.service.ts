import { api } from './api';

export const blogService = {
  async getFeaturedBlogs() {
    const response = await api.get('/blogs/featured');
    return response.data.blogs || [];
  },

  async getRecentBlogs(limit: number = 12) {
    const response = await api.get(`/blogs/recent?limit=${limit}`);
    return response.data.blogs || [];
  },

  async getBlogBySlug(slug: string) {
    const response = await api.get(`/blogs/${slug}`);
    return response.data.blog;
  }
  ,

  async getAllBlogs() {
    const response = await api.get('/blogs/all');
    return response.data.blogs || [];
  },

  async createBlog(blogData: any) {
    const response = await api.post('/blogs', blogData);
    return response.data.blog;
  },

  async updateBlog(blogId: string, blogData: any) {
    const response = await api.put(`/blogs/${blogId}`, blogData);
    return response.data.blog;
  },

  async deleteBlog(blogId: string) {
    const response = await api.delete(`/blogs/${blogId}`);
    return response.data;
  }
};

export default blogService;
