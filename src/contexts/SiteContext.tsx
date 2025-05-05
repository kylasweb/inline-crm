
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SiteContextType {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  updateSiteName: (name: string) => void;
  updatePrimaryColor: (color: string) => void;
  updateSecondaryColor: (color: string) => void;
  updateAccentColor: (color: string) => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  siteName: 'Inline SysCRM',
  primaryColor: '#9b87f5',
  secondaryColor: '#7e69ab',
  accentColor: '#6e59a5',
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteName, setSiteName] = useState(() => {
    const saved = localStorage.getItem('siteName');
    return saved || defaultSettings.siteName;
  });
  
  const [primaryColor, setPrimaryColor] = useState(() => {
    const saved = localStorage.getItem('primaryColor');
    return saved || defaultSettings.primaryColor;
  });
  
  const [secondaryColor, setSecondaryColor] = useState(() => {
    const saved = localStorage.getItem('secondaryColor');
    return saved || defaultSettings.secondaryColor;
  });
  
  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem('accentColor');
    return saved || defaultSettings.accentColor;
  });

  useEffect(() => {
    localStorage.setItem('siteName', siteName);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    localStorage.setItem('accentColor', accentColor);
    
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    // Update the CSS variables for neo colors
    document.documentElement.style.setProperty('--neo-primary', primaryColor);
    document.documentElement.style.setProperty('--neo-secondary', secondaryColor);
    document.documentElement.style.setProperty('--neo-accent', accentColor);
  }, [siteName, primaryColor, secondaryColor, accentColor]);

  const updateSiteName = (name: string) => {
    setSiteName(name);
  };

  const updatePrimaryColor = (color: string) => {
    setPrimaryColor(color);
  };

  const updateSecondaryColor = (color: string) => {
    setSecondaryColor(color);
  };

  const updateAccentColor = (color: string) => {
    setAccentColor(color);
  };

  const resetToDefaults = () => {
    setSiteName(defaultSettings.siteName);
    setPrimaryColor(defaultSettings.primaryColor);
    setSecondaryColor(defaultSettings.secondaryColor);
    setAccentColor(defaultSettings.accentColor);
  };

  return (
    <SiteContext.Provider
      value={{
        siteName,
        primaryColor,
        secondaryColor,
        accentColor,
        updateSiteName,
        updatePrimaryColor,
        updateSecondaryColor,
        updateAccentColor,
        resetToDefaults,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
