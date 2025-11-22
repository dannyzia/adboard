import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HomepageContextType {
  useAlternativeDesign: boolean;
  toggleDesign: () => void;
  setDesign: (useAlternative: boolean) => void;
}

const HomepageContext = createContext<HomepageContextType | undefined>(undefined);

export const useHomepage = () => {
  const context = useContext(HomepageContext);
  if (context === undefined) {
    throw new Error('useHomepage must be used within a HomepageProvider');
  }
  return context;
};

interface HomepageProviderProps {
  children: ReactNode;
}

export const HomepageProvider: React.FC<HomepageProviderProps> = ({ children }) => {
  const [useAlternativeDesign, setUseAlternativeDesign] = useState(() => {
    // Check localStorage for saved preference, default to false (original design)
    const saved = localStorage.getItem('useAlternativeHomepage');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDesign = () => {
    const newValue = !useAlternativeDesign;
    setUseAlternativeDesign(newValue);
    try {
      localStorage.setItem('useAlternativeHomepage', JSON.stringify(newValue));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const setDesign = (useAlternative: boolean) => {
    console.log('Setting design to', useAlternative);
    setUseAlternativeDesign(useAlternative);
    localStorage.setItem('useAlternativeHomepage', JSON.stringify(useAlternative));
  };

  return (
    <HomepageContext.Provider value={{ useAlternativeDesign, toggleDesign, setDesign }}>
      {children}
    </HomepageContext.Provider>
  );
};