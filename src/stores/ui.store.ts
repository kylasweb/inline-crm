import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SpacingConfig {
  container: string
  headerHeight: string
  sidebarWidth: string
  elementGap: string
  sectionPadding: string
}

interface HeaderConfig {
  layout: 'default' | 'centered' | 'minimal'
  showSearch: boolean
  showNotifications: boolean
  showUserProfile: boolean
  fixed: boolean
}

interface SocialLink {
  platform: string
  url: string
  icon: string
}

interface CustomScript {
  id: string
  name: string
  code: string
  active: boolean
}

interface ThemePreset {
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  font: string
  spacing: SpacingConfig
}

export const themePresets: Record<string, ThemePreset> = {
  default: {
    name: 'Default',
    primaryColor: '#9b87f5',
    secondaryColor: '#7e69ab',
    accentColor: '#6e59a5',
    font: 'Inter',
    spacing: {
      container: '2rem',
      headerHeight: '4rem',
      sidebarWidth: '16rem',
      elementGap: '1rem',
      sectionPadding: '2rem'
    }
  },
  modern: {
    name: 'Modern',
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    accentColor: '#60a5fa',
    font: 'Plus Jakarta Sans',
    spacing: {
      container: '3rem',
      headerHeight: '4rem',
      sidebarWidth: '16rem',
      elementGap: '1.5rem',
      sectionPadding: '2rem'
    }
  },
  minimal: {
    name: 'Minimal',
    primaryColor: '#18181b',
    secondaryColor: '#27272a',
    accentColor: '#71717a',
    font: 'DM Sans',
    spacing: {
      container: '1.5rem',
      headerHeight: '4rem',
      sidebarWidth: '16rem',
      elementGap: '0.75rem',
      sectionPadding: '2rem'
    }
  },
  vibrant: {
    name: 'Vibrant',
    primaryColor: '#7c3aed',
    secondaryColor: '#6d28d9',
    accentColor: '#5b21b6',
    font: 'Space Grotesk',
    spacing: {
      container: '2rem',
      headerHeight: '4rem',
      sidebarWidth: '16rem',
      elementGap: '1rem',
      sectionPadding: '2rem'
    }
  }
}

type UIStateData = {
  siteName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  isDarkMode: boolean
  logo: string | null
  favicon: string | null
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  footerText: string
  customCss: string
  activeTheme: string
  customFonts: string[]
  primaryFont: string
  secondaryFont: string
  spacing: SpacingConfig
  customScripts: CustomScript[]
  socialLinks: SocialLink[]
  headerConfig: HeaderConfig
}

interface UIState extends UIStateData {
  updateSiteName: (name: string) => void
  updatePrimaryColor: (color: string) => void
  updateSecondaryColor: (color: string) => void
  updateAccentColor: (color: string) => void
  updateLogo: (logo: string | null) => void
  updateFavicon: (favicon: string | null) => void
  updateMetadata: (metadata: { title?: string; description?: string; keywords?: string }) => void
  updateFooterText: (text: string) => void
  updateCustomCss: (css: string) => void
  setActiveTheme: (themeName: string) => void
  updateFonts: (primary: string, secondary: string) => void
  updateSpacing: (config: Partial<SpacingConfig>) => void
  updateCustomScripts: (scripts: CustomScript[]) => void
  updateSocialLinks: (links: SocialLink[]) => void
  updateHeaderConfig: (config: Partial<HeaderConfig>) => void
  toggleDarkMode: () => void
  resetToDefaults: () => void
}

const defaultHeaderConfig: HeaderConfig = {
  layout: 'default',
  showSearch: true,
  showNotifications: true,
  showUserProfile: true,
  fixed: true
}

const initialState: UIStateData = {
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
  spacing: themePresets.default.spacing,
  customScripts: [],
  socialLinks: [],
  headerConfig: defaultHeaderConfig
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      ...initialState,

      updateSiteName: (name) => set({ siteName: name }),
      updatePrimaryColor: (color) => set({ primaryColor: color }),
      updateSecondaryColor: (color) => set({ secondaryColor: color }),
      updateAccentColor: (color) => set({ accentColor: color }),
      updateLogo: (logo) => set({ logo }),
      updateFavicon: (favicon) => set({ favicon }),
      updateMetadata: (metadata) => set((state) => ({
        ...(metadata.title ? { metaTitle: metadata.title } : {}),
        ...(metadata.description ? { metaDescription: metadata.description } : {}),
        ...(metadata.keywords ? { metaKeywords: metadata.keywords } : {})
      })),
      updateFooterText: (text) => set({ footerText: text }),
      updateCustomCss: (css) => set({ customCss: css }),
      
      setActiveTheme: (themeName) => {
        const theme = themePresets[themeName]
        if (theme) {
          set({
            activeTheme: themeName,
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            accentColor: theme.accentColor,
            primaryFont: theme.font,
            spacing: theme.spacing
          })
        }
      },

      updateFonts: (primary, secondary) => set({
        primaryFont: primary,
        secondaryFont: secondary
      }),

      updateSpacing: (config) => set((state) => ({
        spacing: { ...state.spacing, ...config }
      })),

      updateCustomScripts: (scripts) => set({ customScripts: scripts }),
      updateSocialLinks: (links) => set({ socialLinks: links }),
      
      updateHeaderConfig: (config) => set((state) => ({
        headerConfig: { ...state.headerConfig, ...config }
      })),

      toggleDarkMode: () => set((state) => ({
        isDarkMode: !state.isDarkMode
      })),

      resetToDefaults: () => set(initialState)
    }),
    {
      name: 'ui-storage',
    }
  )
)

// Side effects for UI updates
if (typeof window !== 'undefined') {
  useUIStore.subscribe((state) => {
    // Apply CSS variables
    document.documentElement.style.setProperty('--primary-color', state.primaryColor)
    document.documentElement.style.setProperty('--secondary-color', state.secondaryColor)
    document.documentElement.style.setProperty('--accent-color', state.accentColor)
    document.documentElement.style.setProperty('--neo-primary', state.primaryColor)
    document.documentElement.style.setProperty('--neo-secondary', state.secondaryColor)
    document.documentElement.style.setProperty('--neo-accent', state.accentColor)

    // Apply fonts
    document.documentElement.style.setProperty('--font-primary', state.primaryFont)
    document.documentElement.style.setProperty('--font-secondary', state.secondaryFont)

    // Apply spacing
    Object.entries(state.spacing).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--spacing-${key}`, value)
    })

    // Apply custom CSS
    let customStyleTag = document.getElementById('custom-css')
    if (!customStyleTag) {
      customStyleTag = document.createElement('style')
      customStyleTag.id = 'custom-css'
      document.head.appendChild(customStyleTag)
    }
    customStyleTag.textContent = state.customCss

    // Apply custom scripts
    const scriptTags = document.querySelectorAll('script[data-custom-script]')
    scriptTags.forEach(tag => tag.remove())
    
    state.customScripts.forEach(script => {
      if (script.active) {
        const scriptTag = document.createElement('script')
        scriptTag.setAttribute('data-custom-script', script.id)
        scriptTag.textContent = script.code
        document.body.appendChild(scriptTag)
      }
    })

    // Toggle dark mode
    document.documentElement.classList.toggle('dark', state.isDarkMode)
  })
}