import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { adminService } from '../services/admin.service';
import { archiveService } from '../services/archive.service';
import { Ad } from '../types';
import { LoadingSpinner } from '../components/layout/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export const AdminAdsPage: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAds, setSelectedAds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadAds();
  }, [statusFilter, categoryFilter]);

  const loadAds = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      
      const response = await adminService.getAds(1, 50, filters);
      setAds(response.ads);
    } catch (error) {
      console.error('Failed to load ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAds(new Set(ads.map(ad => ad._id)));
    } else {
      setSelectedAds(new Set());
    }
  };

  const handleSelectAd = (adId: string) => {
    const newSelected = new Set(selectedAds);
    if (newSelected.has(adId)) {
      newSelected.delete(adId);
    } else {
      newSelected.add(adId);
    }
    setSelectedAds(newSelected);
  };

  const handleArchive = async (adId: string) => {
    if (confirm('Are you sure you want to archive this ad?')) {
      try {
        await archiveService.archiveAd(adId, 'Admin action');
        loadAds();
      } catch (error) {
        alert('Failed to archive ad');
      }
    }
  };

  const handleDelete = async (adId: string) => {
    // GitHub-style confirmation: user must type the ad ID
    const userInput = prompt(
      `⚠️ DANGER ZONE ⚠️\n\n` +
      `This will permanently delete this ad.\n` +
      `This action CANNOT be undone.\n\n` +
      `To confirm, please type the ad ID:\n${adId}`
    );
    
    if (userInput === adId) {
      try {
        await adminService.deleteAd(adId, 'Admin action');
        alert('✅ Ad deleted successfully');
        loadAds();
      } catch (error) {
        alert('❌ Failed to delete ad');
      }
    } else if (userInput !== null) {
      // User typed something but it didn't match
      alert('⚠️ Deletion cancelled: ID did not match');
    }
    // If userInput is null, user clicked Cancel - do nothing
  };

  const handleBulkArchive = async () => {
    if (selectedAds.size === 0) return;
    if (confirm(`Archive ${selectedAds.size} selected ads?`)) {
      try {
        await archiveService.bulkArchive(Array.from(selectedAds), 'Bulk admin action');
        setSelectedAds(new Set());
        loadAds();
      } catch (error) {
        alert('Failed to archive ads');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Manage Ads</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Jobs">Jobs</option>
                <option value="Products">Products</option>
                <option value="Services">Services</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Events">Events</option>
                <option value="Notices">Notices</option>
              </select>
            </div>

            <div className="flex items-end">
              {selectedAds.size > 0 && (
                <button
                  onClick={handleBulkArchive}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Archive Selected ({selectedAds.size})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12">
              <LoadingSpinner />
            </div>
          ) : ads.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No ads found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedAds.size === ads.length}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ads.map((ad) => (
                    <tr key={ad._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedAds.has(ad._id)}
                          onChange={() => handleSelectAd(ad._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{ad._id.substring(0, 8)}...</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{ad.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ad.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ad.location.city}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          ad.status === 'active' ? 'bg-green-100 text-green-800' :
                          ad.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                          ad.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ad.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ad.views}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(ad.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        <button
                          onClick={() => navigate(`/ad/${ad._id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        {ad.status !== 'archived' && (
                          <button
                            onClick={() => handleArchive(ad._id)}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            Archive
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
