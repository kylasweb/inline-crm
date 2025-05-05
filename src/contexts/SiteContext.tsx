import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemePreset {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
  spacing: SpacingConfig;
}

interface SpacingConfig {
  container: string;
  headerHeight: string;
  sidebarWidth: string;
  elementGap: string;
  sectionPadding: string;
}

interface HeaderConfig {
  layout: 'default' | 'centered' | 'minimal';
  showSearch: boolean;
  showNotifications: boolean;
  showUserProfile: boolean;
  fixed: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface CustomScript {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

interface SiteContextType {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDarkMode: boolean;
  logo: string | null;
  favicon: string | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  footerText: string;
  customCss: string;
  activeTheme: string;
  customFonts: string[];
  primaryFont: string;
  secondaryFont: string;
  spacing: SpacingConfig;
  customScripts: CustomScript[];
  socialLinks: SocialLink[];
  headerConfig: HeaderConfig;
  updateSiteName: (name: string) => void;
  updatePrimaryColor: (color: string) => void;
  updateSecondaryColor: (color: string) => void;
  updateAccentColor: (color: string) => void;
  updateLogo: (logo: string | null) => void;
  updateFavicon: (favicon: string | null) => void;
  updateMetadata: (metadata: { title?: string; description?: string; keywords?: string }) => void;
  updateFooterText: (text: string) => void;
  updateCustomCss: (css: string) => void;
  setActiveTheme: (themeName: string) => void;
  updateFonts: (primary: string, secondary: string) => void;
  updateSpacing: (config: Partial<SpacingConfig>) => void;
  updateCustomScripts: (scripts: CustomScript[]) => void;
  updateSocialLinks: (links: SocialLink[]) => void;
  updateHeaderConfig: (config: Partial<HeaderConfig>) => void;
  toggleDarkMode: () => void;
  resetToDefaults: () => void;
}

const defaultSpacing: SpacingConfig = {
  container: '2rem',
  headerHeight: '4rem',
  sidebarWidth: '16rem',
  elementGap: '1rem',
  sectionPadding: '2rem'
};

const defaultHeaderConfig: HeaderConfig = {
  layout: 'default',
  showSearch: true,
  showNotifications: true,
  showUserProfile: true,
  fixed: true
};

const themePresets: Record<string, ThemePreset> = {
  default: {
    name: 'Default',
    primaryColor: '#9b87f5',
    secondaryColor: '#7e69ab',
    accentColor: '#6e59a5',
    font: 'Inter',
    spacing: defaultSpacing
  },
  modern: {
    name: 'Modern',
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    accentColor: '#60a5fa',
    font: 'Plus Jakarta Sans',
    spacing: {
      ...defaultSpacing,
      container: '3rem',
      elementGap: '1.5rem'
    }
  },
  minimal: {
    name: 'Minimal',
    primaryColor: '#18181b',
    secondaryColor: '#27272a',
    accentColor: '#71717a',
    font: 'DM Sans',
    spacing: {
      ...defaultSpacing,
      container: '1.5rem',
      elementGap: '0.75rem'
    }
  },
  vibrant: {
    name: 'Vibrant',
    primaryColor: '#7c3aed',
    secondaryColor: '#6d28d9',
    accentColor: '#5b21b6',
    font: 'Space Grotesk',
    spacing: defaultSpacing
  }
};

const defaultSettings = {
  siteName: 'Inline SysCRM',
  primaryColor: themePresets.default.primaryColor,
  secondaryColor: themePresets.default.secondaryColor,
  accentColor: themePresets.default.accentColor,
  isDarkMode: false,
  logo: null,
  favicon: null,
  metaTitle: 'Inline SysCRM - IT Business Management Solution',
  metaDescription: 'Comprehensive CRM solution for IT companies to manage leads, opportunities, and customer relationships.',
  metaKeywords: 'CRM, IT Business, Lead Management, Customer Relationship, Business Management',
  footerText: '© 2025 Inline SysCRM. All rights reserved.',
  customCss: '',
  activeTheme: 'default',
  customFonts: ['Inter', 'Plus Jakarta Sans', 'DM Sans', 'Space Grotesk'],
  primaryFont: 'Inter',
  secondaryFont: 'DM Sans',
  spacing: defaultSpacing,
  customScripts: [],
  socialLinks: [],
  headerConfig: defaultHeaderConfig
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

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : defaultSettings.isDarkMode;
  });

  const [logo, setLogo] = useState<string | null>(() => {
    const saved = localStorage.getItem('logo');
    return saved || defaultSettings.logo;
  });

  const [favicon, setFavicon] = useState<string | null>(() => {
    const saved = localStorage.getItem('favicon');
    return saved || defaultSettings.favicon;
  });

  const [metaTitle, setMetaTitle] = useState(() => {
    const saved = localStorage.getItem('metaTitle');
    return saved || defaultSettings.metaTitle;
  });

  const [metaDescription, setMetaDescription] = useState(() => {
    const saved = localStorage.getItem('metaDescription');
    return saved || defaultSettings.metaDescription;
  });

  const [metaKeywords, setMetaKeywords] = useState(() => {
    const saved = localStorage.getItem('metaKeywords');
    return saved || defaultSettings.metaKeywords;
  });

  const [footerText, setFooterText] = useState(() => {
    const saved = localStorage.getItem('footerText');
    return saved || defaultSettings.footerText;
  });

  const [customCss, setCustomCss] = useState(() => {
    const saved = localStorage.getItem('customCss');
    return saved || defaultSettings.customCss;
  });

  const [activeTheme, setActiveTheme] = useState(() => {
    const saved = localStorage.getItem('activeTheme');
    return saved || defaultSettings.activeTheme;
  });

  const [customFonts, setCustomFonts] = useState(() => {
    const saved = localStorage.getItem('customFonts');
    return saved ? JSON.parse(saved) : defaultSettings.customFonts;
  });

  const [primaryFont, setPrimaryFont] = useState(() => {
    const saved = localStorage.getItem('primaryFont');
    return saved || defaultSettings.primaryFont;
  });

  const [secondaryFont, setSecondaryFont] = useState(() => {
    const saved = localStorage.getItem('secondaryFont');
    return saved || defaultSettings.secondaryFont;
  });

  const [spacing, setSpacing] = useState<SpacingConfig>(() => {
    const saved = localStorage.getItem('spacing');
    return saved ? JSON.parse(saved) : defaultSettings.spacing;
  });

  const [customScripts, setCustomScripts] = useState<CustomScript[]>(() => {
    const saved = localStorage.getItem('customScripts');
    return saved ? JSON.parse(saved) : defaultSettings.customScripts;
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    const saved = localStorage.getItem('socialLinks');
    return saved ? JSON.parse(saved) : defaultSettings.socialLinks;
  });

  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(() => {
    const saved = localStorage.getItem('headerConfig');
    return saved ? JSON.parse(saved) : defaultSettings.headerConfig;
  });

  useEffect(() => {
    // Save all settings to localStorage
    localStorage.setItem('siteName', siteName);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    localStorage.setItem('accentColor', accentColor);
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('logo', logo || '');
    localStorage.setItem('favicon', favicon || '');
    localStorage.setItem('metaTitle', metaTitle);
    localStorage.setItem('metaDescription', metaDescription);
    localStorage.setItem('metaKeywords', metaKeywords);
    localStorage.setItem('footerText', footerText);
    localStorage.setItem('customCss', customCss);
    localStorage.setItem('activeTheme', activeTheme);
    localStorage.setItem('customFonts', JSON.stringify(customFonts));
    localStorage.setItem('primaryFont', primaryFont);
    localStorage.setItem('secondaryFont', secondaryFont);
    localStorage.setItem('spacing', JSON.stringify(spacing));
    localStorage.setItem('customScripts', JSON.stringify(customScripts));
    localStorage.setItem('socialLinks', JSON.stringify(socialLinks));
    localStorage.setItem('headerConfig', JSON.stringify(headerConfig));

    // Apply CSS variables
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--neo-primary', primaryColor);
    document.documentElement.style.setProperty('--neo-secondary', secondaryColor);
    document.documentElement.style.setProperty('--neo-accent', accentColor);

    // Apply fonts
    document.documentElement.style.setProperty('--font-primary', primaryFont);
    document.documentElement.style.setProperty('--font-secondary', secondaryFont);

    // Apply spacing
    Object.entries(spacing).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply custom CSS
    let customStyleTag = document.getElementById('custom-css');
    if (!customStyleTag) {
      customStyleTag = document.createElement('style');
      customStyleTag.id = 'custom-css';
      document.head.appendChild(customStyleTag);
    }
    customStyleTag.textContent = customCss;

    // Apply custom scripts
    const scriptTags = document.querySelectorAll('script[data-custom-script]');
    scriptTags.forEach(tag => tag.remove());
    
    customScripts.forEach(script => {
      if (script.active) {
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('data-custom-script', script.id);
        scriptTag.textContent = script.code;
        document.body.appendChild(scriptTag);
      }
    });

    // Toggle dark mode
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [
    siteName, primaryColor, secondaryColor, accentColor, isDarkMode,
    logo, favicon, metaTitle, metaDescription, metaKeywords,
    footerText, customCss, activeTheme, customFonts, primaryFont,
    secondaryFont, spacing, customScripts, socialLinks, headerConfig
  ]);

  const updateSiteName = (name: string) => setSiteName(name);
  const updatePrimaryColor = (color: string) => setPrimaryColor(color);
  const updateSecondaryColor = (color: string) => setSecondaryColor(color);
  const updateAccentColor = (color: string) => setAccentColor(color);
  const updateLogo = (newLogo: string | null) => setLogo(newLogo);
  const updateFavicon = (newFavicon: string | null) => setFavicon(newFavicon);
  const updateFooterText = (text: string) => setFooterText(text);
  const updateCustomCss = (css: string) => setCustomCss(css);

  const updateMetadata = (metadata: { title?: string; description?: string; keywords?: string }) => {
    if (metadata.title) setMetaTitle(metadata.title);
    if (metadata.description) setMetaDescription(metadata.description);
    if (metadata.keywords) setMetaKeywords(metadata.keywords);
  };

  const setActiveThemeAndApply = (themeName: string) => {
    const theme = themePresets[themeName];
    if (theme) {
      setPrimaryColor(theme.primaryColor);
      setSecondaryColor(theme.secondaryColor);
      setAccentColor(theme.accentColor);
      setPrimaryFont(theme.font);
      setSpacing(theme.spacing);
      setActiveTheme(themeName);
    }
  };

  const updateFonts = (primary: string, secondary: string) => {
    setPrimaryFont(primary);
    setSecondaryFont(secondary);
  };

  const updateSpacing = (config: Partial<SpacingConfig>) => {
    setSpacing(prev => ({ ...prev, ...config }));
  };

  const updateCustomScripts = (scripts: CustomScript[]) => {
    setCustomScripts(scripts);
  };

  const updateSocialLinks = (links: SocialLink[]) => {
    setSocialLinks(links);
  };

  const updateHeaderConfig = (config: Partial<HeaderConfig>) => {
    setHeaderConfig(prev => ({ ...prev, ...config }));
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const resetToDefaults = () => {
    setSiteName(defaultSettings.siteName);
    setPrimaryColor(defaultSettings.primaryColor);
    setSecondaryColor(defaultSettings.secondaryColor);
    setAccentColor(defaultSettings.accentColor);
    setIsDarkMode(defaultSettings.isDarkMode);
    setLogo(defaultSettings.logo);
    setFavicon(defaultSettings.favicon);
    setMetaTitle(defaultSettings.metaTitle);
    setMetaDescription(defaultSettings.metaDescription);
    setMetaKeywords(defaultSettings.metaKeywords);
    setFooterText(defaultSettings.footerText);
    setCustomCss(defaultSettings.customCss);
    setActiveTheme(defaultSettings.activeTheme);
    setCustomFonts(defaultSettings.customFonts);
    setPrimaryFont(defaultSettings.primaryFont);
    setSecondaryFont(defaultSettings.secondaryFont);
    setSpacing(defaultSettings.spacing);
    setCustomScripts(defaultSettings.customScripts);
    setSocialLinks(defaultSettings.socialLinks);
    setHeaderConfig(defaultSettings.headerConfig);
  };

  return (
    <SiteContext.Provider
      value={{
        siteName,
        primaryColor,
        secondaryColor,
        accentColor,
        isDarkMode,
        logo,
        favicon,
        metaTitle,
        metaDescription,
        metaKeywords,
        footerText,
        customCss,
        activeTheme,
        customFonts,
        primaryFont,
        secondaryFont,
        spacing,
        customScripts,
        socialLinks,
        headerConfig,
        updateSiteName,
        updatePrimaryColor,
        updateSecondaryColor,
        updateAccentColor,
        updateLogo,
        updateFavicon,
        updateMetadata,
        updateFooterText,
        updateCustomCss,
        setActiveTheme: setActiveThemeAndApply,
        updateFonts,
        updateSpacing,
        updateCustomScripts,
        updateSocialLinks,
        updateHeaderConfig,
        toggleDarkMode,
        resetToDefaults,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
