import { api } from './api';
import { Ad, ArchiveMetadata, AdminFilters } from '../types';

export const archiveService = {
  /**
   * Archive an ad
   */
  async archiveAd(id: string, reason: string): Promise<void> {
    await api.put(`/admin/ads/${id}/archive`, { reason });
  },

  /**
   * Restore an ad from archive
   */
  async restoreAd(id: string, reason?: string): Promise<Ad> {
    const response = await api.post<Ad>(`/admin/ads/${id}/restore`, { reason });
    return response.data;
  },

  /**
   * Permanently delete an ad
   */
  async permanentDelete(id: string, reason: string, confirmed: boolean): Promise<void> {
    await api.delete(`/admin/ads/${id}/permanent-delete`, {
      data: { reason, confirmed },
    });
  },

  /**
   * Get archived items
   */
  async getArchived(
    page: number = 1,
    limit: number = 50,
    filters?: AdminFilters
  ): Promise<{
    items: Ad[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params: any = { page, limit, ...filters };
    const response = await api.get('/admin/archive', { params });
    return response.data;
  },

  /**
   * Get archive metadata
   */
  async getArchiveMetadata(id: string): Promise<ArchiveMetadata> {
    const response = await api.get<ArchiveMetadata>(`/admin/archive/${id}`);
    return response.data;
  },

  /**
   * Set or remove legal hold
   */
  async setLegalHold(id: string, legalHold: boolean, reason?: string): Promise<void> {
    await api.put(`/admin/archive/${id}/legal-hold`, { legalHold, reason });
  },

  /**
   * Bulk archive
   */
  async bulkArchive(ids: string[], reason: string): Promise<{ success: number; failed: number }> {
    const response = await api.post('/admin/archive/bulk-archive', { ids, reason });
    return response.data;
  },

  /**
   * Bulk restore
   */
  async bulkRestore(ids: string[], reason?: string): Promise<{ success: number; failed: number }> {
    const response = await api.post('/admin/archive/bulk-restore', { ids, reason });
    return response.data;
  },

  /**
   * Bulk delete
   */
  async bulkDelete(ids: string[], reason: string, confirmed: boolean): Promise<{ success: number; failed: number }> {
    const response = await api.post('/admin/archive/bulk-delete', { ids, reason, confirmed });
    return response.data;
  },

  /**
   * Export to cold storage
   */
  async exportToColdStorage(ids: string[]): Promise<{ success: number; failed: number }> {
    const response = await api.post('/admin/archive/export-to-cold-storage', { ids });
    return response.data;
  },

  /**
   * Search cold storage
   */
  async searchColdStorage(query: string, dateRange?: { from: string; to: string }): Promise<ArchiveMetadata[]> {
    const response = await api.get('/admin/archive/cold-storage/search', {
      params: { query, ...dateRange },
    });
    return response.data;
  },
};
