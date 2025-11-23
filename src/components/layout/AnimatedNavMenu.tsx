import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/animated-nav.css';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface AnimatedNavMenuProps {
  items: NavItem[];
  className?: string;
  onSearch?: (query: string) => void;
}

export const AnimatedNavMenu: React.FC<AnimatedNavMenuProps> = ({
  items,
  className = '',
  onSearch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<string>('');
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Set active item based on current path
  useEffect(() => {
    const currentItem = items.find(item => item.path === location.pathname);
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname, items]);

  // Update indicator position when active item changes
  useEffect(() => {
    const activeIndex = items.findIndex(item => item.id === activeItem);
    if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
      const activeElement = itemRefs.current[activeIndex];
      const rect = activeElement.getBoundingClientRect();
      const parentRect = activeElement.parentElement?.getBoundingClientRect();
      
      if (parentRect) {
        setIndicatorStyle({
          left: rect.left - parentRect.left,
          width: rect.width
        });
      }
    }
  }, [activeItem, items, isOpen]);

  // Handle menu open/close animations
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle item click
  const handleItemClick = (item: NavItem) => {
    setActiveItem(item.id);
    navigate(item.path);
    // Optional: close menu after navigation on mobile
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
    }
  };

return (
  <nav className={className}>
      {/* Menu Toggle Button (for mobile) */}
      <button
        onClick={toggleMenu}
        className={`md:hidden animated-nav-toggle p-2 rounded-lg bg-gray-100 hover:bg-gray-200 ${isOpen ? 'menu-open' : ''}`}
        aria-label="Toggle navigation menu"
      >
        <div className="w-6 h-6 relative">
          <span className={`menu-icon-lines line-1 absolute w-6 h-0.5 bg-gray-600 top-1 left-0 transition-all duration-300`}></span>
          <span className={`menu-icon-lines line-2 absolute w-6 h-0.5 bg-gray-600 top-3 left-0 transition-all duration-300`}></span>
          <span className={`menu-icon-lines line-3 absolute w-6 h-0.5 bg-gray-600 top-5 left-0 transition-all duration-300`}></span>
        </div>
      </button>

      {/* Search Bar (Desktop) */}
      {onSearch && (
        <form onSubmit={handleSearch} className="hidden lg:flex items-center mr-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-3 bg-teal-600 text-white rounded-r-lg hover:bg-teal-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      )}

      {/* Navigation Items Container */}
      <div className="relative">
        {/* Desktop: Always visible, Mobile: Hidden/Shown based on isOpen */}
        <ul className={`
          animated-nav-items
          ${isOpen ? 'flex' : 'hidden'}
          md:flex
          flex-col md:flex-row
          gap-2 md:gap-1
          p-4 md:p-0
          bg-white md:bg-transparent
          rounded-lg md:rounded-none
          shadow-lg md:shadow-none
          absolute md:relative
          top-full md:top-0
          left-0 md:left-auto
          right-0 md:right-auto
          mt-2 md:mt-0
          z-50
        `}>
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                ref={el => itemRefs.current[index] = el}
                onClick={() => handleItemClick(item)}
                className={`
                  animated-nav-item
                  w-full md:w-auto
                  px-4 py-3 md:py-2
                  text-left md:text-center
                  rounded-lg md:rounded-none
                  ${activeItem === item.id
                    ? 'active'
                    : ''
                  }
                  stagger-delay-${Math.min(index + 1, 8)}
                `}
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0px) translateZ(0px)' : 'translateY(10px) translateZ(0px)',
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  transitionDuration: '0.4s',
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="animated-nav-icon">
                    {item.icon}
                  </span>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Active Indicator Bar (Desktop only) */}
        <div
          className="animated-nav-indicator hidden md:block"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            opacity: activeItem ? 1 : 0,
          }}
        />
      </div>

      {/* Overlay for mobile (when menu is open) */}
      {isOpen && (
        <div
          className="animated-nav-overlay md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

// Example usage with common navigation items
export const MainNavigation: React.FC<{ className?: string; onSearch?: (query: string) => void }> = ({ className, onSearch }) => {
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'browse',
      label: 'Browse Ads',
      path: '/#browse-ads',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: 'post',
      label: 'Post Ad',
      path: '/post-ad',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      id: 'blog',
      label: 'Blog',
      path: '/blog',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      id: 'contact',
      label: 'Contact',
      path: '/terms-contact',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return <AnimatedNavMenu items={navItems} className={className} onSearch={onSearch} />;
};
