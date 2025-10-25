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
    const adUrl = `${window.location.origin}/ad/${ad._id}`;
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
        className="ad-card bg-white rounded shadow-sm overflow-hidden relative cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
        onClick={() => onClick(ad._id)}
      >
        {/* Image Container - 1:1 Aspect Ratio */}
        <div className="relative aspect-square">
          <img
            src={getImageUrl(ad.images[0])}
            alt={ad.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Category Badge */}
          <span className={`absolute top-1 left-1 ${categoryColor} text-white text-xs px-1.5 py-0.5 rounded text-[10px]`}>
            {ad.category}
          </span>

          {/* Featured Badge */}
          {ad.isFeatured && (
            <span className="absolute top-1 left-16 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded text-[10px] font-semibold">
              ★
            </span>
          )}

          {/* 3-Dot Menu Button */}
          <button
            className="absolute top-1 right-1 bg-white/95 rounded-full p-1 hover:bg-white shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2"></circle>
              <circle cx="12" cy="12" r="2"></circle>
              <circle cx="12" cy="19" r="2"></circle>
            </svg>
          </button>
        </div>

        {/* Card Content */}
        <div className="p-2">
          <h4 className="font-semibold text-xs text-gray-800 mb-1 line-clamp-2">
            {ad.title}
          </h4>
          <div className="flex items-center justify-between text-[9px] text-gray-500">
            <span className="truncate">{ad.location.city}</span>
            <span className="whitespace-nowrap">
              {formatTimeAgo(ad.createdAt)}
            </span>
          </div>
          {ad.price !== undefined && ad.price > 0 && (
            <div className="mt-1 font-bold text-blue-600 text-[10px]">
              {CURRENCIES.find(c => c.code === (ad.currency || 'USD'))?.symbol || '$'}{ad.price.toLocaleString()} {ad.currency || 'USD'}
            </div>
          )}
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
