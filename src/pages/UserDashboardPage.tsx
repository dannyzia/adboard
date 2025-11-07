import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useAuth } from '../hooks/useAuth';
import { adService } from '../services/ad.service';
import { bidService } from '../services/bid.service';
import type { Ad } from '../types/ad.types';
import { useToast } from '../components/ui/ToastContext';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myAds, setMyAds] = useState<Ad[]>([]);
  const [favoriteAds, setFavoriteAds] = useState<Ad[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [myAuctions, setMyAuctions] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-ads' | 'favorites' | 'settings' | 'my-bids' | 'my-auctions'>('my-ads');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title?: string;
    message?: string;
    onConfirm?: () => void;
  }>({ isOpen: false });
  const toast = useToast();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    adExpiry: true,
    messages: true,
    newsletter: false,
  });

  // Helper to get image URL (handle both string and object formats)
  const getImageUrl = (image: string | { url: string; publicId?: string; order?: number } | undefined): string => {
    if (!image) return 'https://via.placeholder.com/150';
    if (typeof image === 'string') return image;
    return image.url;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user's ads using dedicated endpoint (returns all statuses for the owner)
      const userAds = await adService.getMyAds();
      console.log('User ads:', userAds);
      setMyAds(userAds);

      // Load auctions posted by the user
      const auctions = userAds.filter(a => a.category === 'Auction');
      setMyAuctions(auctions);

      // Load user's bids
      try {
        const bids = await bidService.getMyBids();
        setMyBids(bids);
      } catch (err) {
        console.error('Error loading bids:', err);
      }

      // Load favorite ads using dedicated endpoint
      try {
        const favorites = await adService.getFavorites();
        setFavoriteAds(favorites || []);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setFavoriteAds([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Ad',
      message: 'Are you sure you want to delete this ad? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await adService.deleteAd(adId);
          setMyAds(prev => prev.filter(ad => ad._id !== adId));
          toast.showToast('Ad deleted', 'success');
        } catch (error) {
          console.error('Error deleting ad:', error);
          toast.showToast('Failed to delete ad', 'error');
        } finally {
          setConfirmConfig({ isOpen: false });
        }
      }
    });
  };

  const handleEditAd = (adId: string) => {
    navigate(`/post-ad?edit=${adId}`);
  };

  const handleRenewAd = async (_adId: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Renew Ad',
      message: 'Renew this ad for 30 more days?',
      onConfirm: async () => {
        try {
          // TODO: Implement actual renew API call
          toast.showToast('Ad renewed successfully for 30 days!', 'success');
          await loadUserData();
        } catch (error) {
          console.error('Error renewing ad:', error);
          toast.showToast('Failed to renew ad', 'error');
        } finally {
          setConfirmConfig({ isOpen: false });
        }
      }
    });
  };

  const getExpiryCountdown = (expiryDate: string): string => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    return `${diffDays} days left`;
  };

  const getExpiryColor = (expiryDate: string): string => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600';
    if (diffDays <= 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    try {
      // TODO: Implement actual password change API call
      toast.showToast('Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.showToast('Failed to change password', 'error');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      // TODO: Implement actual save notifications API call
      toast.showToast('Notification settings saved!', 'success');
    } catch (error) {
      console.error('Error saving notifications:', error);
      toast.showToast('Failed to save notification settings', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implement actual delete account API call
      toast.showToast('Your account has been deleted', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.showToast('Failed to delete account', 'error');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expired':
        return 'Expired';
      case 'draft':
        return 'Draft';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return status || 'Unknown';
    }
  };

  const handleResubmit = async (adId: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Resubmit Ad',
      message: 'Resubmit this ad for review?',
      onConfirm: async () => {
        try {
          await adService.updateAd(adId, { status: 'pending' });
          toast.showToast('Ad resubmitted for review', 'success');
          await loadUserData();
        } catch (err) {
          console.error('Error resubmitting ad:', err);
          toast.showToast('Failed to resubmit ad', 'error');
        } finally {
          setConfirmConfig({ isOpen: false });
        }
      }
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={() => confirmConfig.onConfirm && confirmConfig.onConfirm()}
        onCancel={() => setConfirmConfig({ isOpen: false })}
        confirmText="Yes"
        cancelText="Cancel"
      />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Member since {formatDate(user.memberSince)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Subscription Plan</div>
              <div className="text-lg font-semibold text-blue-600 capitalize">{user?.subscription?.tier || 'free'}</div>
              <div className="text-sm text-gray-600">{user?.subscription?.adsRemaining || 0} ads remaining</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Ads</p>
                <p className="text-3xl font-bold text-gray-900">{myAds.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Ads</p>
                <p className="text-3xl font-bold text-green-600">{myAds.filter(ad => ad.status === 'active').length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Favorites</p>
                <p className="text-3xl font-bold text-red-600">{favoriteAds.length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('my-ads')}
                className={`py-4 px-2 font-medium transition border-b-2 ${
                  activeTab === 'my-ads'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                My Ads ({myAds.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-2 font-medium transition border-b-2 ${
                  activeTab === 'favorites'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Favorites ({favoriteAds.length})
              </button>
              <button
                onClick={() => setActiveTab('my-bids')}
                className={`py-4 px-2 font-medium transition border-b-2 ${
                  activeTab === 'my-bids'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                My Bids ({myBids.length})
              </button>
              <button
                onClick={() => setActiveTab('my-auctions')}
                className={`py-4 px-2 font-medium transition border-b-2 ${
                  activeTab === 'my-auctions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                My Auctions ({myAuctions.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-2 font-medium transition border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === 'my-ads' && (
                  <div className="space-y-4">
                    {myAds.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="text-gray-600 mb-4">You haven't posted any ads yet</p>
                        <button
                          onClick={() => navigate('/post-ad')}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Post Your First Ad
                        </button>
                      </div>
                    ) : (
                      myAds.map((ad) => (
                        <div key={ad._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex gap-4">
                            <img
                              src={getImageUrl(ad.images[0])}
                              alt={ad.title}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
                                  <p className="text-sm text-gray-600">{ad.category} • {ad.location.city}, {ad.location.state}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                                  {getStatusLabel(ad.status)}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-3 line-clamp-2">{ad.description?.substring(0, 150)}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <div className="text-sm text-gray-600">
                                      <span className="font-medium">{ad.views}</span> views • Posted {formatDate(ad.createdAt)}
                                    </div>
                                    {(ad.status as any) === 'rejected' && (
                                      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded">
                                        <div className="text-sm text-red-700 font-medium">Rejected: {(ad as any).rejectReason || 'No reason provided.'}</div>
                                        <div className="mt-3 flex gap-2">
                                          <button
                                            onClick={() => handleEditAd(ad._id)}
                                            className="px-3 py-1 text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                                          >
                                            Edit & Resubmit
                                          </button>
                                          <button
                                            onClick={() => handleResubmit(ad._id)}
                                            className="px-3 py-1 text-sm bg-yellow-500 text-white hover:bg-yellow-600 rounded-lg transition"
                                          >
                                            Resubmit
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  {ad.expiryDate && (
                                    <div className={`text-sm font-medium ${getExpiryColor(ad.expiryDate)}`}>
                                      {getExpiryCountdown(ad.expiryDate)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => navigate(`/ad/${ad.slug || ad._id}`)}
                                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleEditAd(ad._id)}
                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                  >
                                    Edit
                                  </button>
                                  {ad.status === 'active' && ad.expiryDate && (
                                    <button
                                      onClick={() => handleRenewAd(ad._id)}
                                      className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition"
                                    >
                                      Renew
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteAd(ad._id)}
                                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div className="space-y-4">
                    {favoriteAds.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                        <p className="text-gray-600">No favorite ads yet</p>
                      </div>
                    ) : (
                      favoriteAds.map((ad) => (
                        <div key={ad._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                          onClick={() => navigate(`/ad/${ad.slug || ad._id}`)}
                        >
                          <div className="flex gap-4">
                            <img
                              src={getImageUrl(ad.images[0])}
                              alt={ad.title}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{ad.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{ad.category} • {ad.location.city}, {ad.location.state}</p>
                              <p className="text-gray-700 line-clamp-2">{ad.description?.substring(0, 150)}</p>
                              {ad.price && (
                                <p className="text-lg font-bold text-blue-600 mt-2">${ad.price.toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'my-bids' && (
                  <div className="space-y-4">
                    {myBids.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-600 mb-4">You haven't placed any bids yet</p>
                      </div>
                    ) : (
                      myBids.map((b: any) => (
                        <div key={b._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Bid on: {b.auctionId?.title || 'Auction'}</h3>
                              <p className="text-sm text-gray-600">Amount: {b.bidAmount}</p>
                              <p className="text-sm text-gray-500">Placed: {formatDate(b.placedAt)}</p>
                            </div>
                            <div className="text-sm text-right">
                              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800">{b.status}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'my-auctions' && (
                  <div className="space-y-4">
                    {myAuctions.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-600 mb-4">You haven't posted any auctions yet</p>
                        <button
                          onClick={() => navigate('/post-ad')}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Post an Auction
                        </button>
                      </div>
                    ) : (
                      myAuctions.map((ad) => (
                        <div key={ad._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
                              <p className="text-sm text-gray-600">Status: {ad.auctionDetails?.auctionStatus || 'N/A'}</p>
                              <p className="text-sm text-gray-500">Ends: {formatDate(ad.auctionDetails?.auctionEnd || '')}</p>
                            </div>
                            <div className="text-right">
                              <button
                                onClick={() => navigate(`/ad/${ad.slug || ad._id}`)}
                                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-2xl space-y-8">
                    {/* Password Change */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={8}
                          />
                          <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Notification Preferences */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive email updates about your account</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.emailNotifications}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Ad Expiry Reminders</p>
                            <p className="text-sm text-gray-600">Get notified before your ads expire</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.adExpiry}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, adExpiry: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Messages</p>
                            <p className="text-sm text-gray-600">Receive notifications about new messages</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.messages}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, messages: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Newsletter</p>
                            <p className="text-sm text-gray-600">Receive our weekly newsletter</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.newsletter}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, newsletter: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <button
                          onClick={handleSaveNotifications}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Delete Account */}
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-gray-900 font-medium mb-2">Delete Account</p>
                        <p className="text-sm text-gray-700 mb-4">
                          Once you delete your account, there is no going back. All your ads and data will be permanently deleted.
                        </p>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you absolutely sure you want to delete your account? All of your data including ads, favorites, and profile will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
