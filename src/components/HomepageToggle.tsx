import React from 'react';
import { useHomepage } from '../context/HomepageContext';

export const HomepageToggle: React.FC = () => {
  const { useAlternativeDesign, toggleDesign } = useHomepage();

  const handleClassicClick = () => {
    if (useAlternativeDesign) {
      toggleDesign();
    }
  };

  const handleEnhancedClick = () => {
    if (!useAlternativeDesign) {
      toggleDesign();
    }
  };

  return null;
};