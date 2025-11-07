import React, { useState, useEffect } from 'react';
import { useCategories } from '../hooks/useCategories';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCategorySelect }) => {
  const { categories } = useCategories();
  const [visibleCategories, setVisibleCategories] = useState<Array<{ category: any; positionIndex: number }>>([]);

  // Generate 96 non-overlapping positions across the entire map
  const allPositions = React.useMemo(() => {
    const positions = [];
    // Create a grid of positions covering the entire map
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 8; col++) {
        positions.push({
          top: `${5 + (row * 7.5)}%`,  // Spread from 5% to 87.5%
          left: `${5 + (col * 12)}%`,  // Spread from 5% to 89%
        });
      }
    }
    return positions;
  }, []);

  const handleCategoryClick = (categoryValue: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryValue);
    }
  };

  useEffect(() => {
    if (categories.length === 0) return;

    const showBatch = () => {
      // Get currently used position indices
      const usedPositions = visibleCategories.map(vc => vc.positionIndex);
      
      // Get available positions
      const availablePositions = allPositions
        .map((_, index) => index)
        .filter(index => !usedPositions.includes(index));

      if (availablePositions.length < 3) {
        // Not enough positions, clear some old ones
        setVisibleCategories([]);
        return;
      }

      // Show 3 random categories at 3 different positions
      const newCategories = [];
      for (let i = 0; i < 3; i++) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomIndex = Math.floor(Math.random() * availablePositions.length);
        const randomPositionIndex = availablePositions[randomIndex];
        
        // Remove used position from available list
        availablePositions.splice(randomIndex, 1);
        
        newCategories.push({ category: randomCategory, positionIndex: randomPositionIndex });
      }

      setVisibleCategories(newCategories);

      // Clear after 1 second (plus animation time)
      setTimeout(() => {
        setVisibleCategories([]);
      }, 3000); // Total cycle: 1s fade in + 1s stay + 1s fade out
    };

    // Show first batch immediately
    showBatch();

    // Then show new batch every 3.5 seconds (allowing for cleanup time)
    const interval = setInterval(showBatch, 3500);

    return () => clearInterval(interval);
  }, [categories, allPositions]);

  return (
    <div className="relative text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/world-map.webp)' }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/90 via-cyan-500/85 to-blue-500/90"></div>
      
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          {/* Headline */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            Post Your Ad & Discover
            <span className="block text-yellow-300">Do not hesitate, it's Free</span>
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
            Your ad listing board for everything
          </p>
        </div>

        {/* Categories popping up randomly across the map */}
        <div className="relative h-64 lg:h-80">
          {visibleCategories.map((item, index) => {
            const position = allPositions[item.positionIndex];
            return (
              <button
                key={`${item.category.value}-${item.positionIndex}-${index}`}
                onClick={() => handleCategoryClick(item.category.value)}
                className="absolute px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-full transition-all transform hover:scale-110 shadow-lg hover:shadow-xl border-2 border-white/50 whitespace-nowrap"
                style={{ 
                  top: position.top, 
                  left: position.left,
                  animation: 'popUpDisappear 3s ease-in-out forwards',
                }}
              >
                {item.category.label}
              </button>
            );
          })}
        </div>

        <style>{`
          @keyframes popUpDisappear {
            0% {
              opacity: 0;
              transform: scale(0.5) translateY(20px);
            }
            33% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
            66% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
            100% {
              opacity: 0;
              transform: scale(0.5) translateY(20px);
            }
          }
        `}</style>
      </div>
    </div>
  );
};
