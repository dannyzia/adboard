import { api } from './api';
import {
  AdminStats,
  AdminActivity,
  AdminUser,
  Report,
  AdminFilters,
  BulkAction,
  AuditLog,
} from '../types';
import { Ad } from '../types/ad.types';

// Toggle mock data mode
const USE_MOCK_DATA = false;

export const adminService = {
  /**
   * Get admin dashboard statistics
   */
  async getStats(): Promise<AdminStats> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        totalAds: {
          total: 1890,
          active: 1234,
          expired: 567,
          archived: 89,
          deleted: 0,
        },
        users: {
          total: 5755,
          free: 5432,
          basic: 234,
          pro: 89,
          suspended: 5,
          banned: 2,
        },
        revenue: {
          mrr: 4567,
          growth: 12,
          thisMonth: 4567,
          lastMonth: 4078,
        },
        activity: {
          newAdsToday: 45,
          newUsersToday: 12,
          reportsToday: 3,
          viewsToday: 2456,
        },
      };
    }

    const response = await api.get<{success: boolean; stats: any; recentUsers: any[]; recentAds: any[]}>('/admin/stats');
    
    // Transform backend response to match AdminStats interface
    const data = response.data;
    return {
      totalAds: {
        total: data.stats.totalAds || 0,
        active: data.stats.activeAds || 0,
        expired: data.stats.expiredAds || 0,
        archived: data.stats.archivedAds || 0,
        deleted: data.stats.deletedAds || 0,
      },
      users: {
        total: data.stats.totalUsers || 0,
        free: data.stats.freeUsers || 0,
        basic: data.stats.basicUsers || 0,
        pro: data.stats.proUsers || 0,
        suspended: 0,
        banned: 0,
      },
      revenue: {
        mrr: data.stats.monthlyRevenue || 0,
        growth: 0,
        thisMonth: data.stats.monthlyRevenue || 0,
        lastMonth: 0,
      },
      activity: {
        newAdsToday: data.stats.newAdsToday || 0,
        newUsersToday: data.stats.newUsersToday || 0,
        reportsToday: 0,
        viewsToday: 0,
      },
    };
  },

  /**
   * Get recent admin activity
   */
  async getActivity(_limit: number = 10): Promise<AdminActivity[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [
        {
          _id: '1',
          type: 'ad_created',
          description: 'New ad posted: Senior Software Engineer',
          userId: 'user-1',
          entityId: 'ad-1',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
          _id: '2',
          type: 'user_registered',
          description: 'New user registered: john@example.com',
          userId: 'user-2',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          _id: '3',
          type: 'subscription_upgraded',
          description: 'User upgraded to Pro plan',
          userId: 'user-3',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
      ];
    }

    // Backend doesn't have activity endpoint yet, return empty for now
    // TODO: Add /admin/activity endpoint to backend
    return [];
    
    // const response = await api.get<AdminActivity[]>('/admin/dashboard/activity', {
    //   params: { limit },
    // });
    // return response.data;
  },

  /**
   * Get all ads with admin filters
   */
  async getAds(page: number = 1, limit: number = 50, filters?: AdminFilters): Promise<{
    ads: Ad[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (USE_MOCK_DATA) {
      // Import mock ads from ad.service
      const { adService } = await import('./ad.service');
      const adFilters = filters ? {
        category: filters.category as any,
        search: filters.search,
        location: {
          country: undefined,
          state: undefined,
          city: undefined,
        },
      } : undefined;
      const result = await adService.getAds(page, limit, adFilters);
      return {
        ads: result.ads,
        total: result.totalAds,
        page: result.page,
        totalPages: result.totalPages,
      };
    }
    
    const params: any = { page, limit, ...filters };
    const response = await api.get('/admin/ads', { params });
    return response.data;
  },

  /**
   * Update an ad (admin)
   */
  async updateAd(id: string, data: Partial<Ad>): Promise<Ad> {
    const response = await api.put<Ad>(`/admin/ads/${id}`, data);
    return response.data;
  },

  /**
   * Delete an ad (admin)
   */
  async deleteAd(id: string, reason: string): Promise<void> {
    await api.delete(`/admin/ads/${id}`, { data: { reason } });
  },

  /**
   * Bulk actions on ads
   */
  async bulkAction(action: BulkAction): Promise<{ success: number; failed: number }> {
    const response = await api.post('/admin/ads/bulk-action', action);
    return response.data;
  },

  /**
   * Get all users with admin filters
   */
  async getUsers(page: number = 1, limit: number = 50, filters?: AdminFilters): Promise<{
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params: any = { page, limit, ...filters };
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Update user (admin)
   */
  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    const response = await api.put<AdminUser>(`/admin/users/${id}`, data);
    return response.data;
  },

  /**
   * Suspend user
   */
  async suspendUser(id: string, reason: string, duration?: string): Promise<void> {
    await api.post(`/admin/users/${id}/suspend`, { reason, duration });
  },

  /**
   * Ban user
   */
  async banUser(id: string, reason: string): Promise<void> {
    await api.post(`/admin/users/${id}/ban`, { reason });
  },

  /**
   * Unsuspend/unban user
   */
  async reinstateUser(id: string): Promise<void> {
    await api.post(`/admin/users/${id}/reinstate`);
  },

  /**
   * Get all reports
   */
  async getReports(page: number = 1, limit: number = 50, status?: string): Promise<{
    reports: Report[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params: any = { page, limit, status };
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  /**
   * Get a single report
   */
  async getReport(id: string): Promise<Report> {
    const response = await api.get<Report>(`/admin/reports/${id}`);
    return response.data;
  },

  /**
   * Resolve a report
   */
  async resolveReport(id: string, resolution: string): Promise<Report> {
    const response = await api.put<Report>(`/admin/reports/${id}/resolve`, { resolution });
    return response.data;
  },

  /**
   * Get audit logs
   */
  async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    filters?: {
      entityType?: string;
      entityId?: string;
      action?: string;
      performedBy?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<{
    logs: AuditLog[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params: any = { page, limit, ...filters };
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },

  /**
   * Export audit logs
   */
  async exportAuditLogs(filters?: any): Promise<Blob> {
    const response = await api.post('/admin/audit-logs/export', filters, {
      responseType: 'blob',
    });
    return response.data;
  },
};
