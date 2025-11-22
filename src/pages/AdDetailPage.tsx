import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adService } from '../services/ad.service';
import { bidService } from '../services/bid.service';
import { useAuth } from '../hooks/useAuth';
import { Ad } from '../types';
import { LoadingSpinner } from '../components/layout/LoadingSpinner';
import { formatTimeAgo, formatDate, formatDateTime } from '../utils/helpers';
import { CATEGORY_COLORS, CURRENCIES } from '../utils/constants';
import { useToast } from '../components/ui/ToastContext';
import { InputDialog } from '../components/ui/InputDialog';

export const AdDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [ad, setAd] = useState<Ad | null>(null);
  const [similarAds, setSimilarAds] = useState<Ad[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { user } = useAuth();
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [placingBid, setPlacingBid] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);
  const toast = useToast();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportAdId, setReportAdId] = useState<string | null>(null);

  // Helper to get image URL (handle both string and object formats)
  const getImageUrl = (image: string | { url: string; publicId?: string; order?: number } | undefined): string => {
    if (!image) return 'https://via.placeholder.com/800x500?text=No+Image';
    if (typeof image === 'string') return image;
    return image.url;
  };

  useEffect(() => {
    const fetchAd = async () => {
      if (!slug) return;
      
  try {
    setLoading(true);
  const fetchedAd = await adService.getAdById(slug || '');
  setAd(fetchedAd);
        
        // Fetch similar ads (only if location exists)
        if (fetchedAd.location) {
          // Use the actual ad _id for exclude when fetching similar ads
          const similar = await adService.getSimilarAds(fetchedAd._id, fetchedAd.category, fetchedAd.location);
          setSimilarAds(similar);
        }

        // If auction, load bids
        if (fetchedAd.category === 'Auction') {
          try {
            const fetchedBids = await bidService.getAuctionBids(fetchedAd._id);
            setBids(fetchedBids || []);
          } catch (err) {
            console.error('Failed to load bids:', err);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load ad');
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [slug]);

  const handleShare = (platform?: string) => {
    const url = window.location.href;
    const text = `Check out: ${ad?.title}`;

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!ad) return;
    if (e.key === 'ArrowLeft') {
      setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : ad.images.length - 1));
    } else if (e.key === 'ArrowRight') {
      setSelectedImageIndex(prev => (prev < ad.images.length - 1 ? prev + 1 : 0));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ad]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ad Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This ad may have been removed'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Home</span>
          <span>/</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate(`/?category=${ad.category}`)}>{ad.category}</span>
          <span>/</span>
          <span className="text-gray-800 truncate max-w-md">{ad.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={getImageUrl(ad.images[selectedImageIndex])}
                  alt={ad.title}
                  className="w-full h-96 object-cover"
                />
                
                {/* Navigation Arrows */}
                {ad.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : ad.images.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => (prev < ad.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {ad.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {ad.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {ad.images.length > 1 && (
                <div className="flex space-x-2 p-4 overflow-x-auto">
                  {ad.images.map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-24 h-16 object-cover rounded cursor-pointer transition ${
                        selectedImageIndex === index 
                          ? 'border-2 border-blue-600 ring-2 ring-blue-200' 
                          : 'border-2 border-transparent hover:border-blue-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Ad Details */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              {/* Category Badge */}
              <span className={`inline-block ${CATEGORY_COLORS[ad.category]} text-white text-xs px-3 py-1 rounded-full mb-3`}>
                {ad.category}
              </span>
              
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex-1">{ad.title}</h1>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="ml-4 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Share this ad"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  </svg>
                  {ad.location?.city}, {ad.location?.state}, {ad.location?.country}
                </div>
                <span>•</span>
                <span>Posted {formatTimeAgo(ad.createdAt)}</span>
                <span>•</span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  {ad.views} views
                </div>
              </div>

              {ad.price !== undefined && ad.price > 0 && (
                <div className="text-3xl font-bold text-blue-600 mb-6">
                  {CURRENCIES.find(c => c.code === (ad.currency || 'USD'))?.symbol || '$'}{ad.price.toLocaleString()} {ad.currency || 'USD'}
                </div>
              )}

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{ad.description}</p>
              </div>

              {ad.links && (ad.links.link1 || ad.links.link2) && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Links or Additional Resources</h3>
                  <div className="space-y-2">
                    {ad.links.link1 && (
                      <a
                        href={ad.links.link1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition group"
                      >
                        <span className="text-gray-700 group-hover:text-blue-600 truncate">{ad.links.link1}</span>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </a>
                    )}
                    {ad.links.link2 && (
                      <a
                        href={ad.links.link2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition group"
                      >
                        <span className="text-gray-700 group-hover:text-blue-600 truncate">{ad.links.link2}</span>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Details from Form */}
              {(() => {
                // Collect all additional details - both from details object and top-level fields
                const additionalDetails: Record<string, any> = {};
                
                // Add details object fields
                if ((ad as any).details && typeof (ad as any).details === 'object') {
                  Object.assign(additionalDetails, (ad as any).details);
                }
                
                // Add common top-level fields that should be displayed
                const topLevelFields = [
                  'brandModel', 'condition', 'year', 'warranty', 'specifications',
                  'color', 'storageCapacity', 'mileage', 'fuelType', 'transmission',
                  'vin', 'engineSize', 'type', 'length', 'engineType', 'hullMaterial',
                  'sleepingCapacity', 'amenities', 'propertyType', 'bedrooms', 'bathrooms',
                  'squareFootage', 'lotSize', 'yearBuilt', 'garage', 'rentFrequency',
                  'utilitiesIncluded', 'furnished', 'zoningType', 'leaseTerms',
                  'checkInOutDates', 'maxGuests', 'jobType', 'salaryRange',
                  'experienceRequired', 'remoteOnsite', 'applicationDeadline',
                  'compensationType', 'serviceType', 'availability', 'experienceLevel',
                  'certifications', 'size', 'material', 'gender', 'dimensions',
                  'sportType', 'author', 'genre', 'isbn', 'edition', 'format',
                  'petType', 'breed', 'age', 'vaccinated', 'cuisineType',
                  'dietaryOptions', 'ingredients', 'expirationDate', 'venue',
                  'duration', 'inclusions', 'discountPercentage', 'validityPeriod',
                  'eventDate', 'ticketType', 'quantityAvailable', 'organizer',
                  'capacity', 'deliveryOptions', 'paymentMethods', 'noticeType',
                  'effectiveDate', 'contactPerson', 'safetyCertifications',
                  'medium', 'instrumentType', 'accessoriesIncluded', 'quantity',
                  'digitalFormat', 'fileSize', 'compatibility', 'licenseType',
                  'version', 'lessonType', 'subject', 'level', 'mode',
                  'repairType', 'pickupLocation', 'toolsRequired', 'reasonForGivingAway',
                  'priceType'
                ];
                
                topLevelFields.forEach(field => {
                  if ((ad as any)[field] !== undefined && (ad as any)[field] !== null && (ad as any)[field] !== '') {
                    additionalDetails[field] = (ad as any)[field];
                  }
                });
                
                const detailsCount = Object.keys(additionalDetails).length;
                
                return detailsCount > 0 ? (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(additionalDetails)
                        .filter(([, value]) => value !== undefined && value !== null && value !== '')
                        .map(([key, value]) => {
                          // Format the key (convert camelCase to Title Case)
                          const formattedKey = key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())
                            .trim();
                          
                          // Format the value
                          let formattedValue = String(value);
                          
                          // Handle special cases
                          if (key === 'auctionEnd' && typeof value === 'string') {
                            formattedValue = formatDateTime(value);
                          } else if (key.toLowerCase().includes('date') && typeof value === 'string') {
                            try {
                              formattedValue = formatDate(value);
                            } catch (e) {
                              formattedValue = String(value);
                            }
                          } else if (typeof value === 'boolean') {
                            formattedValue = value ? 'Yes' : 'No';
                          } else if (Array.isArray(value)) {
                            formattedValue = value.join(', ');
                          }

                          return (
                            <div key={key} className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">{formattedKey}</div>
                              <div className="font-semibold text-gray-800">{formattedValue}</div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Safety Tips</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Meet in a safe, public location</li>
                    <li>• Check the item before you buy</li>
                    <li>• Pay only after collecting item</li>
                    <li>• Beware of unrealistic offers</li>
                    <li>• Never share financial information</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Advertiser</h3>
              
              <div className="space-y-3">
                <a
                  href={`mailto:${ad.contactEmail || ''}`}
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Send Email
                </a>
                
                {ad.contactPhone && (
                  <a
                    href={`tel:${ad.contactPhone}`}
                    className="flex items-center justify-center w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Call Now
                  </a>
                )}

                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center justify-center w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                  Share
                </button>
                
                <button
                  onClick={() => {
                    if (!user) {
                      toast.showToast('Please login to report this ad', 'info');
                      return;
                    }
                    setReportAdId(ad._id);
                    setReportOpen(true);
                  }}
                  className="flex items-center justify-center w-full border border-red-300 text-red-600 py-3 rounded-lg hover:bg-red-50 transition font-semibold"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  Report Ad
                </button>
              </div>
              <InputDialog
                isOpen={reportOpen}
                title="Report Ad"
                placeholder="Describe why you're reporting this ad"
                onCancel={() => { setReportOpen(false); setReportAdId(null); }}
                onSubmit={async (reason) => {
                  if (!reportAdId) return;
                  try {
                    await adService.reportAd(reportAdId, reason);
                    toast.showToast('Ad reported. Our team will review it.', 'success');
                  } catch (err: any) {
                    toast.showToast(err?.response?.data?.message || 'Failed to report ad', 'error');
                  } finally {
                    setReportOpen(false);
                    setReportAdId(null);
                  }
                }}
              />

              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Ad ID:</span>
                    <span className="font-semibold text-gray-800">#{ad._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posted:</span>
                    <span className="font-semibold text-gray-800">{formatDateTime(ad.createdAt)}{ad.user?.name ? ` by ${ad.user.name}` : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span className="font-semibold text-gray-800">{ad.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auction / Bidding Widget */}
            {ad.category === 'Auction' && (
              <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-24">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Auction</h3>
                <div className="mb-3">
                  <div className="text-sm text-gray-600">Current Bid</div>
                  <div className="text-2xl font-bold text-blue-600">{ad.auctionDetails?.currentBid ? `${ad.auctionDetails.currentBid} ${ad.currency || 'USD'}` : `Starting ${ad.auctionDetails?.startingBid || '0'} ${ad.currency || 'USD'}`}</div>
                </div>
                <div className="mb-3">
                  <div className="text-sm text-gray-600">Ends</div>
                  <div className="text-sm text-gray-800">{ad.auctionDetails?.auctionEnd ? formatDate(ad.auctionDetails.auctionEnd) : 'N/A'}</div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Bid</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={`Enter amount in ${ad.currency || 'USD'}`}
                  />
                </div>

                {bidError && <div className="text-red-600 text-sm mb-2">{bidError}</div>}
                {bidSuccess && <div className="text-green-600 text-sm mb-2">{bidSuccess}</div>}

                <button
                  onClick={async () => {
                    setBidError(null);
                    setBidSuccess(null);
                    if (!user) {
                      setBidError('You must be logged in to place a bid');
                      return;
                    }
                    const amount = parseFloat(bidAmount);
                    const current = ad.auctionDetails?.currentBid ?? ad.auctionDetails?.startingBid ?? 0;
                    if (isNaN(amount) || amount <= current) {
                      setBidError(`Bid must be greater than current bid (${current})`);
                      return;
                    }

                    setPlacingBid(true);
                    try {
                      await bidService.placeBid(ad._id, amount);
                      setBidSuccess('Bid placed successfully');
                      // Refresh ad and bids
                      const refreshed = await adService.getAdById(ad._id);
                      setAd(refreshed);
                      const updatedBids = await bidService.getAuctionBids(ad._id);
                      setBids(updatedBids || []);
                      setBidAmount('');
                    } catch (err: any) {
                      console.error('Place bid error:', err);
                      setBidError(err?.response?.data?.message || err?.message || 'Failed to place bid');
                    } finally {
                      setPlacingBid(false);
                    }
                  }}
                  disabled={placingBid}
                  className={`w-full py-3 ${placingBid ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-bold rounded-lg transition`}
                >
                  {placingBid ? 'Placing bid...' : 'Place Bid'}
                </button>

                {/* Simple bid history */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Bids</h4>
                  {bids.length === 0 ? (
                    <div className="text-sm text-gray-600">No bids yet</div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {bids.map((b: any) => (
                        <div key={b._id} className="flex justify-between text-sm">
                          <div>{b.bidderId?.name || 'User'}</div>
                          <div className="font-medium">{b.bidAmount}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Similar Ads */}
            {similarAds.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Similar Ads</h3>
                <div className="space-y-3">
                  {similarAds.slice(0, 3).map((similarAd) => (
                    <div
                      key={similarAd._id}
                      onClick={() => navigate(`/ad/${similarAd.slug || similarAd._id}`)}
                      className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                      <img
                        src={getImageUrl(similarAd.images[0])}
                        alt={similarAd.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-800 mb-1 truncate">{similarAd.title}</h4>
                        <p className="text-xs text-gray-600 mb-1">{similarAd.location?.city}, {similarAd.location?.state}</p>
                        {similarAd.price !== undefined && similarAd.price > 0 && (
                          <p className="text-sm font-bold text-blue-600">
                            {CURRENCIES.find(c => c.code === (similarAd.currency || 'USD'))?.symbol || '$'}{similarAd.price.toLocaleString()} {similarAd.currency || 'USD'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Share this ad</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-600 transition"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
                <span className="text-sm font-medium">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition"
              >
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                </svg>
                <span className="text-sm font-medium">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-600 transition"
              >
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                </svg>
                <span className="text-sm font-medium">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('copy')}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                {copySuccess ? (
                  <>
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm font-medium text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm font-medium">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AdDetailPage;
