import React, { useState, useRef, useEffect } from 'react';
import { Ad } from '../../types';
import { CURRENCIES, getCategoryColor } from '../../utils/constants';
import { formatTimeAgo } from '../../utils/helpers';
import { useCategories } from '../../hooks/useCategories';

interface AdCardEnhancedProps {
  ad: Ad;
  onClick: (id: string) => void;
}

export const AdCardEnhanced: React.FC<AdCardEnhancedProps> = ({ ad, onClick }) => {
  const { categories } = useCategories();
  const category = categories.find(c => c.value === ad.category);
  const categoryColor = category ? getCategoryColor(ad.category, category.color) : 'bg-gray-600';
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Helper to get image URL (handle both string and object formats)
  const getImageUrl = (image: string | { url: string; publicId?: string; order?: number } | undefined) => {
    if (!image) return 'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop';
    if (typeof image === 'string') return image;
    return image.url;
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleShare = async () => {
    const adUrl = `${window.location.origin}/ad/${ad.slug || ad._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad.title,
          text: ad.description?.substring(0, 200) || ad.title,
          url: adUrl,
        });
      } catch (err) {
        // User cancelled share or share failed
        if ((err as Error).name !== 'AbortError') {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(adUrl);
          alert('Link copied to clipboard!');
        }
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(adUrl);
      alert('Link copied to clipboard!');
    }
    setShowMenu(false);
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowMenu(false);
  };

  return (
    <div className="relative group">
      <div
        className="ad-card bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        onClick={() => onClick(ad.slug || ad._id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced Image Container */}
        <div className="relative aspect-square overflow-hidden">
          {/* Image loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
          )}
          
          <img
            src={getImageUrl(ad.images[0])}
            alt={ad.title}
            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Enhanced Category Badge */}
          <span className={`absolute top-2 left-2 ${categoryColor} text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm backdrop-blur-sm`}>
            {ad.category}
          </span>

          {/* Enhanced Featured Badge */}
          {ad.isFeatured && (
            <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-md font-bold shadow-sm animate-pulse">
              ⭐ Featured
            </span>
          )}

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
          
          {/* Enhanced 3-Dot Menu Button */}
          <button
            className={`absolute bottom-2 right-2 bg-white/95 hover:bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2"></circle>
              <circle cx="12" cy="12" r="2"></circle>
              <circle cx="12" cy="19" r="2"></circle>
            </svg>
          </button>
        </div>

        {/* Enhanced Card Content */}
        <div className="p-3">
          <h4 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-teal-600 transition-colors duration-300">
            {ad.title}
          </h4>
          {ad.price !== undefined && ad.price > 0 && (
            <div className="mb-2 font-bold text-teal-600 text-lg group-hover:text-teal-700 transition-colors duration-300">
              {CURRENCIES.find(c => c.code === (ad.currency || 'USD'))?.symbol || '$'}{ad.price.toLocaleString()}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1 truncate group-hover:text-teal-600 transition-colors duration-300">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {ad.location.city}
            </span>
            <span className="whitespace-nowrap group-hover:text-teal-600 transition-colors duration-300">
              {formatTimeAgo(ad.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Dropdown Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute bottom-full right-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleShare}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 flex items-center gap-2 transition-all duration-200"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>

          {/* Link 1 */}
          {ad.links?.link1 && (
            <>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => handleLinkClick(ad.links!.link1!)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-start gap-2 transition-all duration-200"
                title={ad.links.link1}
              >
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="truncate text-[11px] leading-tight">
                  {ad.links.link1.replace('https://', '').replace('http://', '').substring(0, 25)}
                </span>
              </button>
            </>
          )}

          {/* Link 2 */}
          {ad.links?.link2 && (
            <button
              onClick={() => handleLinkClick(ad.links!.link2!)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-start gap-2 transition-all duration-200"
              title={ad.links.link2}
            >
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="truncate text-[11px] leading-tight">
                {ad.links.link2.replace('https://', '').replace('http://', '').substring(0, 25)}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};