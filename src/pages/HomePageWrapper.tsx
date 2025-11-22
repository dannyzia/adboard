import React from 'react';
import { HomePage } from './HomePage';
import { useHomepage } from '../context/HomepageContext';

export const HomePageWrapper: React.FC = () => {
  const { useAlternativeDesign } = useHomepage();

  // Always show the main design (which is now enhanced)
  return <HomePage />;
};