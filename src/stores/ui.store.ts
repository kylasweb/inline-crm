import { StateCreator } from 'zustand';
import { createPersistStore } from './config';

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

interface ThemePreset {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
  spacing: SpacingConfig;
}

// Base state without actions
interface UIStateWithoutActions {
  // Theme
  isDarkMode: boolean;
  activeTheme: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Typography
  primaryFont: string;
  secondaryFont: string;
  customFonts: string[];
  
  // Layout
  spacing: SpacingConfig;
  headerConfig: HeaderConfig;
  isSidebarOpen: boolean;
  isHeaderVisible: boolean;
  
  // Custom Styles
  customCss: string;
}

// Full state including actions
interface UIState extends UIStateWithoutActions {
  // Actions
  toggleDarkMode: () => void;
  setTheme: (themeName: string, preset: ThemePreset) => void;
  updateColors: (colors: { primary?: string; secondary?: string; accent?: string }) => void;
  updateFonts: (fonts: { primary?: string; secondary?: string }) => void;
  updateSpacing: (config: Partial<SpacingConfig>) => void;
  updateHeaderConfig: (config: Partial<HeaderConfig>) => void;
  toggleSidebar: () => void;
  setHeaderVisibility: (visible: boolean) => void;
  updateCustomCss: (css: string) => void;
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

const initialState: UIStateWithoutActions = {
  isDarkMode: false,
  activeTheme: 'default',
  primaryColor: '#9b87f5',
  secondaryColor: '#7e69ab',
  accentColor: '#6e59a5',
  primaryFont: 'Inter',
  secondaryFont: 'DM Sans',
  customFonts: ['Inter', 'Plus Jakarta Sans', 'DM Sans', 'Space Grotesk'],
  spacing: defaultSpacing,
  headerConfig: defaultHeaderConfig,
  isSidebarOpen: true,
  isHeaderVisible: true,
  customCss: '',
};

const createUISlice: StateCreator<UIState> = (set, get) => ({
  ...initialState,

  toggleDarkMode: () => {
    set(state => ({ isDarkMode: !state.isDarkMode }));
    document.documentElement.classList.toggle('dark', get().isDarkMode);
  },

  setTheme: (themeName: string, preset: ThemePreset) => {
    set({
      activeTheme: themeName,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      primaryFont: preset.font,
      spacing: preset.spacing,
    });
    applyThemeToDOM(get());
  },

  updateColors: ({ primary, secondary, accent }) => {
    set(state => ({
      primaryColor: primary ?? state.primaryColor,
      secondaryColor: secondary ?? state.secondaryColor,
      accentColor: accent ?? state.accentColor,
    }));
    applyThemeToDOM(get());
  },

  updateFonts: ({ primary, secondary }) => {
    set(state => ({
      primaryFont: primary ?? state.primaryFont,
      secondaryFont: secondary ?? state.secondaryFont,
    }));
    applyThemeToDOM(get());
  },

  updateSpacing: (config) => {
    set(state => ({
      spacing: { ...state.spacing, ...config }
    }));
    applyThemeToDOM(get());
  },

  updateHeaderConfig: (config) => {
    set(state => ({
      headerConfig: { ...state.headerConfig, ...config }
    }));
  },

  toggleSidebar: () => {
    set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setHeaderVisibility: (visible) => {
    set({ isHeaderVisible: visible });
  },

  updateCustomCss: (css) => {
    set({ customCss: css });
    applyCustomCssToDOM(css);
  },

  resetToDefaults: () => {
    set(initialState);
    applyThemeToDOM(initialState);
    applyCustomCssToDOM(initialState.customCss);
  },
});

// Helper function to apply theme variables to DOM
const applyThemeToDOM = (state: UIStateWithoutActions) => {
  const {
    primaryColor,
    secondaryColor,
    accentColor,
    primaryFont,
    secondaryFont,
    spacing
  } = state;

  document.documentElement.style.setProperty('--primary-color', primaryColor);
  document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  document.documentElement.style.setProperty('--accent-color', accentColor);
  document.documentElement.style.setProperty('--font-primary', primaryFont);
  document.documentElement.style.setProperty('--font-secondary', secondaryFont);

  Object.entries(spacing).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--spacing-${key}`, value);
  });
};

// Helper function to apply custom CSS
const applyCustomCssToDOM = (css: string) => {
  let customStyleTag = document.getElementById('custom-css');
  if (!customStyleTag) {
    customStyleTag = document.createElement('style');
    customStyleTag.id = 'custom-css';
    document.head.appendChild(customStyleTag);
  }
  customStyleTag.textContent = css;
};

export const useUIStore = createPersistStore(createUISlice, 'ui-store', 1);