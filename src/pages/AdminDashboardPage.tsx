import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { adminService } from '../services/admin.service';
import { AdminStats, AdminActivity } from '../types';
import { LoadingSpinner } from '../components/layout/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, activityData] = await Promise.all([
        adminService.getStats(),
        adminService.getActivity(10),
      ]);
      setStats(statsData);
      setActivity(activityData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Ads */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Total Ads</h3>
              <span className="text-2xl">📢</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats?.totalAds.total.toLocaleString()}</div>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <div>Active: {stats?.totalAds.active.toLocaleString()}</div>
              <div>Expired: {stats?.totalAds.expired.toLocaleString()}</div>
              <div>Archived: {stats?.totalAds.archived.toLocaleString()}</div>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Users</h3>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats?.users.total.toLocaleString()}</div>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <div>Free: {stats?.users.free.toLocaleString()}</div>
              <div>Basic: {stats?.users.basic.toLocaleString()}</div>
              <div>Pro: {stats?.users.pro.toLocaleString()}</div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Revenue (MRR)</h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">${stats?.revenue.mrr.toLocaleString()}</div>
            <div className="mt-2 text-sm">
              <span className={`font-semibold ${stats?.revenue.growth && stats.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.revenue.growth && stats.revenue.growth > 0 ? '+' : ''}{stats?.revenue.growth}%
              </span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              This month: ${stats?.revenue.thisMonth.toLocaleString()}
            </div>
          </div>

          {/* Activity Today */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Activity Today</h3>
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats?.activity.newAdsToday}</div>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <div>New Ads: {stats?.activity.newAdsToday}</div>
              <div>New Users: {stats?.activity.newUsersToday}</div>
              <div>Reports: {stats?.activity.reportsToday}</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-6">
            {activity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item._id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                    <div className="text-2xl">
                      {item.type === 'ad_created' && '📢'}
                      {item.type === 'user_registered' && '👤'}
                      {item.type === 'report_filed' && '🚨'}
                      {item.type === 'subscription_upgraded' && '⭐'}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{item.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
