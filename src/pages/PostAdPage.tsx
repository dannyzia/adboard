import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useAuth } from '../hooks/useAuth';
import { adService } from '../services/ad.service';
import { uploadService } from '../services/upload.service';
import { COUNTRIES, STATES, CITIES, CURRENCIES } from '../utils/constants';
import { useCategories } from '../hooks/useCategories';
import type { CategoryType, CreateAdData } from '../types/ad.types';
import { ImageUploadZone } from '../components/forms/ImageUploadZone';

export const PostAdPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const editAdId = searchParams.get('edit');
  const { categories, loading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState<CreateAdData>({
    title: '',
    description: '',
    category: '' as CategoryType,
    price: undefined,
    currency: 'USD',
    images: [],
    location: {
      country: 'United States',
      state: '',
      city: '',
    },
    links: {
      link1: '',
      link2: '',
    },
    contactEmail: '',
    contactPhone: '',
    customDuration: undefined, // Will default to plan's max duration if not set
  });

  const [imageUrls, setImageUrls] = useState<string[]>(['', '', '', '']);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Pre-fill contact info from user
    if (user) {
      setFormData(prev => ({
        ...prev,
        contact: {
          email: user.email,
          phone: user.phone || '',
        },
      }));
    }

    // Load ad data if editing
    if (editAdId) {
      loadAdData(editAdId);
    } else {
      // Load draft from localStorage
      loadDraft();
    }
  }, [isAuthenticated, user, editAdId, navigate]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!editAdId && formData.title.trim()) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [formData, imageUrls, imageFiles, editAdId]);

  const loadAdData = async (adId: string) => {
    try {
      const ad = await adService.getAdById(adId);
      
      // Convert images to string array (extract URLs from objects if needed)
      const imageStrings = ad.images.map(img => 
        typeof img === 'string' ? img : img.url
      );
      
      setFormData({
        title: ad.title,
        description: ad.description,
        category: ad.category,
        price: ad.price,
        currency: ad.currency || 'USD',
        images: imageStrings,
        location: ad.location,
        links: ad.links || { link1: '', link2: '' },
        contactEmail: ad.contactEmail || '',
        contactPhone: ad.contactPhone || '',
      });
      setImageUrls([...imageStrings, '', '', '', ''].slice(0, 4));
    } catch (error) {
      console.error('Error loading ad:', error);
      alert('Failed to load ad data');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title must be less than 100 characters';
    
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length > 5000) newErrors.description = 'Description must be less than 5000 characters';
    
    if (!formData.location.state) newErrors.state = 'State is required';
    if (!formData.location.city) newErrors.city = 'City is required';
    
    if (!formData.contactEmail) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      // Helper function to normalize URLs
      const normalizeUrl = (url: string): string => {
        if (!url) return '';
        const trimmed = url.trim();
        if (!trimmed) return '';
        // Add https:// if no protocol is specified
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
          return `https://${trimmed}`;
        }
        return trimmed;
      };

      // Upload files first
      const uploadedImageUrls = await uploadImages();

      // Convert all images to the format expected by backend: {url, publicId?, order}
      const validImages = [
        // URL inputs - convert to object format
        ...imageUrls
          .filter(url => url.trim() !== '')
          .map((url, index) => ({
            url: normalizeUrl(url),
            order: index
          })),
        // Cloudinary uploads - already have url and publicId
        ...uploadedImageUrls.map((item, index) => ({
          url: item.url,
          publicId: item.publicId,
          order: imageUrls.filter(url => url.trim() !== '').length + index
        }))
      ];
      
      const adData: CreateAdData = {
        ...formData,
        images: validImages,
        links: {
          link1: normalizeUrl(formData.links?.link1 || ''),
          link2: normalizeUrl(formData.links?.link2 || ''),
        },
      };

      if (editAdId) {
        await adService.updateAd(editAdId, adData);
        alert('Ad updated successfully!');
      } else {
        await adService.createAd(adData);
        alert('Ad posted successfully!');
        clearDraft(); // Clear draft after successful post
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error posting ad:', error);
      
      // Check if it's an upgrade required error
      if (error.response?.data?.upgradeRequired) {
        setUpgradeMessage(error.response.data.message || 'Please upgrade your plan to use this feature.');
        setShowUpgradeModal(true);
      } else {
        alert(error.response?.data?.message || 'Failed to post ad. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
  };

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<Array<{url: string, publicId: string}>> => {
    if (imageFiles.length === 0) return [];

    try {
      const uploadedResults: Array<{url: string, publicId: string}> = [];
      
      // Upload images to Cloudinary
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadProgress(Math.round(((i + 1) / imageFiles.length) * 100));
        
        const result = await uploadService.uploadImage(imageFiles[i]);
        uploadedResults.push({ url: result.url, publicId: result.publicId });
      }

      setUploadProgress(0);
      setImageFiles([]); // Clear files after upload
      return uploadedResults;
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadProgress(0);
      throw new Error('Failed to upload images. Please try again.');
    }
  };

  const saveDraft = () => {
    try {
      const draft = {
        formData,
        imageUrls,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('adDraft', JSON.stringify(draft));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem('adDraft');
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.formData);
        setImageUrls(draft.imageUrls);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('adDraft');
  };

  const availableStates = STATES[formData.location.country] || [];
  const availableCities = CITIES[formData.location.state] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {editAdId ? 'Edit Ad' : 'Post a New Ad'}
            </h1>
            {!editAdId && (
              <div className="flex items-center gap-2">
                {draftSaved && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Draft saved
                  </span>
                )}
                <button
                  type="button"
                  onClick={saveDraft}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  Save Draft
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Full Stack Developer Needed"
                maxLength={100}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              <p className="text-gray-500 text-xs mt-1">{(formData.title || '').length}/100 characters</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={categoriesLoading}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={6}
                placeholder="Detailed description of your ad"
                maxLength={5000}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-gray-500 text-xs mt-1">{(formData.description || '').length}/5000 characters</p>
            </div>

            {/* Price and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Currency Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price {formData.category === 'Jobs' || formData.category === 'Events' || formData.category === 'Notices' ? '(Optional - e.g., Salary/Ticket Price)' : '(Optional)'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500">
                    {CURRENCIES.find(c => c.code === formData.currency)?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={
                      formData.category === 'Jobs' ? 'Annual salary or hourly rate' :
                      formData.category === 'Events' ? 'Ticket price (leave blank if free)' :
                      formData.category === 'Real Estate' ? 'Sale/Rent price' :
                      '0.00'
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            <div>
              {formData.category === 'Jobs' && (
                <p className="text-gray-500 text-xs mt-1">For jobs, you can enter annual salary, hourly rate, or leave blank</p>
              )}
              {formData.category === 'Real Estate' && (
                <p className="text-gray-500 text-xs mt-1">Enter sale price or monthly rent amount</p>
              )}
            </div>

            {/* Additional Info Fields */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Additional Information
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                {formData.category === 'Jobs' && (
                  <div className="space-y-2">
                    <p><strong>For Jobs:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Use <strong>Full Description</strong> for job requirements, qualifications, and responsibilities</li>
                      <li>Add company website or application portal in <strong>Link 1</strong></li>
                      <li>Add LinkedIn job posting or company page in <strong>Link 2</strong></li>
                      <li>Use <strong>Price</strong> for salary range (optional)</li>
                    </ul>
                  </div>
                )}
                {formData.category === 'Products' && (
                  <div className="space-y-2">
                    <p><strong>For Products:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Use <strong>Full Description</strong> for product specifications and condition</li>
                      <li>Add product listing URL in <strong>Link 1</strong> (e.g., Amazon, eBay)</li>
                      <li>Add manufacturer website in <strong>Link 2</strong></li>
                      <li>Enter price in the <strong>Price</strong> field</li>
                    </ul>
                  </div>
                )}
                {formData.category === 'Services' && (
                  <div className="space-y-2">
                    <p><strong>For Services:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Use <strong>Full Description</strong> for service details and what's included</li>
                      <li>Add your business website in <strong>Link 1</strong></li>
                      <li>Add booking/appointment link in <strong>Link 2</strong></li>
                      <li>Use <strong>Price</strong> for service rates (optional)</li>
                    </ul>
                  </div>
                )}
                {formData.category === 'Real Estate' && (
                  <div className="space-y-2">
                    <p><strong>For Real Estate:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Use <strong>Full Description</strong> for property details, amenities, and features</li>
                      <li>Add virtual tour or property listing URL in <strong>Link 1</strong></li>
                      <li>Add real estate agent website in <strong>Link 2</strong></li>
                      <li>Enter sale/rent price in the <strong>Price</strong> field</li>
                    </ul>
                  </div>
                )}
                {formData.category === 'Events' && (
                  <div className="space-y-2">
                    <p><strong>For Events:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Use <strong>Full Description</strong> for event details, schedule, and agenda</li>
                      <li>Add event registration/ticketing link in <strong>Link 1</strong></li>
                      <li>Add event website or Facebook event page in <strong>Link 2</strong></li>
                      <li>Use <strong>Price</strong> for ticket cost (leave blank if free)</li>
                    </ul>
                  </div>
                )}
                {formData.category === 'Notices' && (
                  <div className="space-y-2">
                    <p><strong>For Notices:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Use <strong>Full Description</strong> for complete notice details</li>
                      <li>Add reference/source link in <strong>Link 1</strong></li>
                      <li>Add related information link in <strong>Link 2</strong></li>
                      <li><strong>Price</strong> field is typically not used for notices</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.location.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, country: e.target.value, state: '', city: '' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.location.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value, city: '' }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select State</option>
                  {availableStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.location.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={!formData.location.state}
                >
                  <option value="">Select City</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (up to 5)
              </label>

              {/* Upload Progress */}
              {uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                    <span>Uploading images...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Drag & Drop Upload Zone */}
              <div className="mb-4">
                <ImageUploadZone
                  images={imageFiles}
                  onUpload={handleFileUpload}
                  onRemove={handleRemoveFile}
                  maxImages={5}
                  maxSize={5}
                />
              </div>

              {/* OR Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">OR use image URLs</span>
                </div>
              </div>
              
              {/* Image Upload Guidelines */}
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                  Image URL Guidelines
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Free Image Hosting Service:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>PostImg.cc</strong> - Fast, no registration, direct links (recommended)</li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Tip:</strong> Upload your images to any hosting service above, then copy the <strong>direct image link</strong> 
                    (must end in .jpg, .png, .gif, or .webp) and paste it below. You can also use www.domain.com format.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Image URL ${index + 1} (e.g., https://i.imgur.com/image.jpg)`}
                    />
                    {url && (
                      <img
                        src={url.startsWith('http') ? url : `https://${url}`}
                        alt={`Preview ${index + 1}`}
                        className="mt-2 w-full h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Invalid+Image+URL';
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External Links (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Add external links related to your ad (websites, social media, product pages, etc.). 
                You can enter URLs with or without https:// - we'll handle it automatically.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Link 1
                  </label>
                  <input
                    type="text"
                    value={formData.links?.link1 || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      links: { ...formData.links, link1: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="www.example.com or https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Link 2
                  </label>
                  <input
                    type="text"
                    value={formData.links?.link2 || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      links: { ...formData.links, link2: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="www.example.com or https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactEmail || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactEmail: e.target.value
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactPhone: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Ad Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Duration
              </label>
              <select
                value={formData.customDuration || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    customDuration: value ? parseInt(value) : undefined
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Use plan default ({
                  user?.subscription?.tier === 'free' ? '7 days' :
                  user?.subscription?.tier === 'basic' ? '30 days' :
                  user?.subscription?.tier === 'pro' ? '90 days' : '7 days'
                })</option>
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                {(user?.subscription?.tier === 'basic' || user?.subscription?.tier === 'pro') && (
                  <>
                    <option value="14">14 days</option>
                    <option value="21">21 days</option>
                    <option value="30">30 days</option>
                  </>
                )}
                {user?.subscription?.tier === 'pro' && (
                  <>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Your {user?.subscription?.tier || 'free'} plan allows ads up to {
                  user?.subscription?.tier === 'free' ? '7' :
                  user?.subscription?.tier === 'basic' ? '30' :
                  user?.subscription?.tier === 'pro' ? '90' : '7'
                } days. 
                {user?.subscription?.tier !== 'pro' && (
                  <span className="text-blue-600"> <a href="/pricing" className="underline">Upgrade</a> for longer durations.</span>
                )}
              </p>
            </div>

            {/* Subscription Info */}
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="font-medium">
                    {user.subscription?.tier === 'pro' 
                      ? 'Pro Plan: Unlimited Ads' 
                      : `Free Plan: ${user.subscription?.adsRemaining || 0} ads remaining`}
                  </span>
                </div>
              </div>
            )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : editAdId ? 'Update Ad' : 'Post Ad'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* Upgrade Required Modal */}
    {showUpgradeModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Upgrade Required</h3>
          </div>
          
          <p className="text-gray-600 mb-6">{upgradeMessage}</p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowUpgradeModal(false);
                navigate('/pricing');
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              View Plans
            </button>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-semibold"
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

export default PostAdPage;
