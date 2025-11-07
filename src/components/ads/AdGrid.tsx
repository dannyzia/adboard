import React from 'react';
import { Ad } from '../../types';
import { AdCard } from './AdCard';
import { useNavigate } from 'react-router-dom';

interface AdGridProps {
  ads: Ad[];
}

export const AdGrid: React.FC<AdGridProps> = ({ ads }) => {
  const navigate = useNavigate();

  const handleAdClick = (slugOrId: string) => {
    navigate(`/ad/${slugOrId}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3">
      {ads.map((ad) => (
        <AdCard key={ad._id} ad={ad} onClick={handleAdClick} />
      ))}
    </div>
  );
};
