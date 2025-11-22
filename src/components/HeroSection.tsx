import React, { useState, useEffect, useRef } from 'react';
import { useCategories } from '../hooks/useCategories';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCategorySelect }) => {
  const { categories } = useCategories();
  const [visibleCategories, setVisibleCategories] = useState<Array<{ id: string; category: any; randomPosition: { top: string; left: string }; color: string }>>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['view', 'share', 'search', 'reply', 'revisit'];

  const handleCategoryClick = (categoryValue: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryValue);
    }
  };

  // Word rotation effect
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(wordInterval);
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    const randomColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#C06C84'
    ];

    const showNextCategory = () => {
      // Generate completely random position
      const randomTop = Math.random() * 80 + 5; // 5% to 85%
      const randomLeft = Math.random() * 80 + 5; // 5% to 85%
      
      // Get a random category
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      // Get a random color (generated once and stored in state)
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];

      // Create unique ID for this popup
      const popupId = `${Date.now()}-${Math.random()}`;

      // Add the new category to the array
      setVisibleCategories(prev => [...prev, { 
        id: popupId,
        category: randomCategory, 
        randomPosition: { 
          top: `${randomTop}%`, 
          left: `${randomLeft}%` 
        },
        color: randomColor
      }]);

      // Remove this specific popup after 3 seconds
      setTimeout(() => {
        setVisibleCategories(prev => prev.filter(item => item.id !== popupId));
      }, 3000);
    };

    // Show first category immediately
    showNextCategory();

    // Then show new category every 1 second
    intervalRef.current = setInterval(showNextCategory, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [categories]);

  return (
    <div ref={heroRef} className="relative text-white overflow-hidden h-screen md:min-h-screen">
      {/* Enhanced Categories popping up randomly across the entire hero section */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {visibleCategories.map((item) => (
            <button
              key={item.id}
              onClick={() => handleCategoryClick(item.category.value)}
              className="absolute px-4 py-2 font-semibold rounded-full transition-all transform hover:scale-110 shadow-lg hover:shadow-xl border-2 border-white/30 whitespace-nowrap backdrop-blur-sm pointer-events-auto"
              style={{
                top: item.randomPosition.top,
                left: item.randomPosition.left,
                animation: 'popUpDisappear 3s ease-in-out forwards',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.8) 0%, rgba(255, 192, 203, 0.8) 50%, rgba(238, 130, 238, 0.8) 100%)',
                color: '#333',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{item.category.icon || '📦'}</span>
                {item.category.label}
              </span>
            </button>
          ))}
      </div>

      {/* Responsive Background Images */}
      <div className="absolute inset-0 z-0">
        {/* Mobile: 9x16 (portrait) - shown only on mobile */}
        <img
          src="/9x16.webp"
          alt="Background"
          className="block md:hidden w-full h-full object-cover object-top"
          style={{
            objectPosition: 'top center',
            objectFit: 'cover'
          }}
        />
        {/* Tablet/Desktop: 16x9 (standard widescreen) - shown from md to 2xl */}
        <img
          src="/16x9.webp"
          alt="Background"
          className="hidden md:block 2xl:hidden w-full h-full object-cover"
          style={{
            objectPosition: 'center center'
          }}
        />
        {/* Ultrawide: 21x9 - shown on 2xl screens and larger (1536px+) */}
        <img
          src="/hero-21x9.png"
          alt="Background"
          className="hidden 2xl:block w-full h-full object-cover"
          style={{
            objectPosition: 'center center'
          }}
        />
      </div>

      {/* Enhanced Decorative shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl animate-pulse z-10" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse z-10" style={{ animationDelay: '1s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-16 md:pt-24 lg:pt-40 lg:pb-24 z-20">
        <div className="text-center mb-12 mt-16 md:mt-0">

          {/* Enhanced Headline */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight text-yellow-400 whitespace-nowrap" style={{
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15)'
          }}>
            Give your ads a permanent Nest
          </h1>
          <h1 className="text-3xl lg:text-5xl font-bold text-yellow-400 max-w-6xl mx-auto mb-8 leading-relaxed" style={{
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15)'
          }}>
            Easy to{' '}
            <span className="inline-block" style={{ transition: 'opacity 0.5s ease-in-out' }}>
              {words[currentWordIndex]}
            </span>{' '}
            anytime.
          </h1>
        </div>

        <style>{`
          @keyframes popUpDisappear {
            0% {
              opacity: 0;
              transform: scale(0.5) translateY(20px);
            }
            20% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
            80% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
            100% {
              opacity: 0;
              transform: scale(0.5) translateY(20px);
            }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};
