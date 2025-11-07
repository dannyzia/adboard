import React, { useState, useRef, useEffect } from 'react';
import { Ad } from '../../types';
import { CURRENCIES, getCategoryColor } from '../../utils/constants';
import { formatTimeAgo } from '../../utils/helpers';
import { useCategories } from '../../hooks/useCategories';

interface AdCardProps {
  ad: Ad;
  onClick: (id: string) => void;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, onClick }) => {
  const { categories } = useCategories();
  const category = categories.find(c => c.value === ad.category);
  const categoryColor = category ? getCategoryColor(ad.category, category.color) : 'bg-gray-600';
  const [showMenu, setShowMenu] = useState(false);
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
    <div className="relative">
      <div
        className="ad-card bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 group"
    onClick={() => onClick(ad.slug || ad._id)}
      >
        {/* Image Container - 1:1 Aspect Ratio */}
        <div className="relative aspect-square">
          <img
            src={getImageUrl(ad.images[0])}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Category Badge */}
          <span className={`absolute top-2 left-2 ${categoryColor} text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm`}>
            {ad.category}
          </span>

          {/* Featured Badge */}
          {ad.isFeatured && (
            <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-md font-bold shadow-sm">
              ⭐ Featured
            </span>
          )}

          {/* 3-Dot Menu Button */}
          <button
            className="absolute bottom-2 right-2 bg-white/95 hover:bg-white rounded-full p-2 shadow-md hover:shadow-lg transition opacity-0 group-hover:opacity-100"
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

        {/* Card Content */}
        <div className="p-3">
          <h4 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
            {ad.title}
          </h4>
          {ad.price !== undefined && ad.price > 0 && (
            <div className="mb-2 font-bold text-teal-600 text-lg">
              {CURRENCIES.find(c => c.code === (ad.currency || 'USD'))?.symbol || '$'}{ad.price.toLocaleString()}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1 truncate">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {ad.location.city}
            </span>
            <span className="whitespace-nowrap">
              {formatTimeAgo(ad.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Dropdown Menu - Outside card to avoid overflow clipping */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute top-8 right-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleShare}
            className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-start gap-2"
                title={ad.links.link1}
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-start gap-2"
              title={ad.links.link2}
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
