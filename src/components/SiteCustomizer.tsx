import React, { useState, useRef } from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Image, Upload, Plus, Trash2 } from 'lucide-react';
import { themePresets } from '@/contexts/SiteContext';

interface CustomizationFormData {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string | null;
  favicon: string | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  footerText: string;
  customCss: string;
  activeTheme: string;
  primaryFont: string;
  secondaryFont: string;
  customFonts: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  spacing: {
    container: string;
    headerHeight: string;
    sidebarWidth: string;
    elementGap: string;
    sectionPadding: string;
  };
  customScripts: Array<{
    id: string;
    name: string;
    code: string;
    active: boolean;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  headerConfig: {
    layout: 'default' | 'centered' | 'minimal';
    showSearch: boolean;
    showNotifications: boolean;
    showUserProfile: boolean;
    fixed: boolean;
  };
}

const SiteCustomizer: React.FC = () => {
  const {
    siteName,
    primaryColor,
    secondaryColor,
    accentColor,
    isDarkMode,
    customFonts,
    primaryFont,
    secondaryFont,
    spacing,
    customScripts,
    socialLinks,
    headerConfig,
    activeTheme,
    updateSiteName,
    updatePrimaryColor,
    updateSecondaryColor,
    updateAccentColor,
    updateFonts,
    updateSpacing,
    updateCustomScripts,
    updateSocialLinks,
    updateHeaderConfig,
    setActiveTheme,
    resetToDefaults
  } = useSiteContext();
  
  const [formData, setFormData] = useState<CustomizationFormData>({
    siteName,
    primaryColor,
    secondaryColor,
    accentColor,
    logo: null,
    favicon: null,
    metaTitle: document.title,
    metaDescription: '',
    metaKeywords: '',
    footerText: '© 2025 ' + siteName + '. All rights reserved.',
    customCss: '',
    activeTheme,
    primaryFont,
    secondaryFont,
    customFonts: (customFonts || []).map(font => ({
      id: font.toLowerCase().replace(/\s+/g, '-'),
      name: font,
      url: '' // Default empty URL since we don't have it from context
    })),
    spacing,
    customScripts,
    socialLinks,
    headerConfig
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteName(formData.siteName);
    updatePrimaryColor(formData.primaryColor);
    updateSecondaryColor(formData.secondaryColor);
    updateAccentColor(formData.accentColor);
    
    // Update metadata
    document.title = formData.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', formData.metaDescription);
    } else {
      const newMetaDesc = document.createElement('meta');
      newMetaDesc.name = 'description';
      newMetaDesc.content = formData.metaDescription;
      document.head.appendChild(newMetaDesc);
    }

    // Update keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', formData.metaKeywords);
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = formData.metaKeywords;
      document.head.appendChild(newMetaKeywords);
    }

    // Update favicon if changed
    if (formData.favicon) {
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.setAttribute('href', formData.favicon);
      }
    }

    // Update theme and fonts
    if (formData.activeTheme !== activeTheme) {
      setActiveTheme(formData.activeTheme);
    }
    updateFonts(formData.primaryFont, formData.secondaryFont);

    // Update layout settings
    updateSpacing(formData.spacing);
    updateHeaderConfig(formData.headerConfig);

    // Update advanced settings
    updateCustomScripts(formData.customScripts);
    updateSocialLinks(formData.socialLinks);

    toast({
      title: "Settings Updated",
      description: "Your site customization changes have been applied.",
    });
  };

  const handleReset = () => {
    resetToDefaults();
    setFormData({
      siteName: 'Inline SysCRM',
      primaryColor: '#9b87f5',
      secondaryColor: '#7e69ab',
      accentColor: '#6e59a5',
      logo: null,
      favicon: null,
      metaTitle: 'Inline SysCRM - IT Business Management Solution',
      metaDescription: 'Comprehensive CRM solution for IT companies to manage leads, opportunities, and customer relationships.',
      metaKeywords: 'CRM, IT Business, Lead Management, Customer Relationship, Business Management',
      footerText: '© 2025 Inline SysCRM. All rights reserved.',
      customCss: '',
      activeTheme: 'default',
      primaryFont: 'Inter',
      secondaryFont: 'Inter',
      customFonts: [],
      spacing: {
        container: '1440px',
        headerHeight: '64px',
        sidebarWidth: '280px',
        elementGap: '16px',
        sectionPadding: '24px'
      },
      customScripts: [],
      socialLinks: [],
      headerConfig: {
        layout: 'default',
        showSearch: true,
        showNotifications: true,
        showUserProfile: true,
        fixed: true
      }
    });
    
    toast({
      title: "Settings Reset",
      description: "Your site customization has been reset to defaults.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Customizer</h1>
        <Button onClick={handleReset} variant="outline" className="neo-button">
          Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branding Form */}
            <div className="neo-card">
              <h2 className="text-lg font-medium mb-4">Brand Identity</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    className="neo-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex flex-col space-y-2">
                    {formData.logo && (
                      <div className="w-40 h-40 relative">
                        <img 
                          src={formData.logo} 
                          alt="Logo preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => logoInputRef.current?.click()}
                      className="neo-button"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'logo')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex flex-col space-y-2">
                    {formData.favicon && (
                      <div className="w-8 h-8 relative">
                        <img 
                          src={formData.favicon} 
                          alt="Favicon preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => faviconInputRef.current?.click()}
                      className="neo-button"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Upload Favicon
                    </Button>
                    <input
                      ref={faviconInputRef}
                      type="file"
                      accept="image/x-icon,image/png"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'favicon')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="neo-input"
                    />
                    <div 
                      className="h-10 w-10 rounded-md border"
                      style={{ backgroundColor: formData.primaryColor }}
                    />
                    <Input
                      type="color"
                      id="primaryColorPicker"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-10 p-1 rounded-md cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      className="neo-input"
                    />
                    <div 
                      className="h-10 w-10 rounded-md border"
                      style={{ backgroundColor: formData.secondaryColor }}
                    />
                    <Input
                      type="color"
                      id="secondaryColorPicker"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-12 h-10 p-1 rounded-md cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="accentColor"
                      name="accentColor"
                      value={formData.accentColor}
                      onChange={handleChange}
                      className="neo-input"
                    />
                    <div 
                      className="h-10 w-10 rounded-md border"
                      style={{ backgroundColor: formData.accentColor }}
                    />
                    <Input
                      type="color"
                      id="accentColorPicker"
                      value={formData.accentColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-12 h-10 p-1 rounded-md cursor-pointer"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full neo-button bg-neo-primary text-white">
                  Apply Changes
                </Button>
              </form>
            </div>

            <div className="neo-card">
              <h2 className="text-lg font-medium mb-4">Preview</h2>
              <div className="space-y-4">
                <div className="neo-flat p-4 rounded-lg">
                  <h3 className="text-lg font-medium" style={{ color: formData.primaryColor }}>
                    {formData.siteName}
                  </h3>
                  <p className="text-sm text-neo-text-secondary">
                    Preview how your customizations will appear across the site
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: formData.primaryColor, color: 'white' }}>
                    Primary Color
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: formData.secondaryColor, color: 'white' }}>
                    Secondary Color
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: formData.accentColor, color: 'white' }}>
                    Accent Color
                  </div>
                  <div className="neo-flat p-4 flex items-center justify-center">
                    <span className="font-medium" style={{ color: formData.primaryColor }}>Neomorphic Style</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    style={{ backgroundColor: formData.primaryColor }} 
                    className="text-white"
                  >
                    Primary Button
                  </Button>
                  <Button 
                    style={{ backgroundColor: formData.secondaryColor }} 
                    className="text-white"
                  >
                    Secondary Button
                  </Button>
                  <Button 
                    variant="outline" 
                    style={{ borderColor: formData.accentColor, color: formData.accentColor }}
                  >
                    Outline Button
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <div className="neo-card">
            <h2 className="text-lg font-medium mb-4">SEO & Metadata</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="neo-input"
                  maxLength={60}
                />
                <p className="text-xs text-neo-text-secondary">
                  {60 - formData.metaTitle.length} characters remaining
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  className="neo-input min-h-[100px]"
                  maxLength={160}
                />
                <p className="text-xs text-neo-text-secondary">
                  {160 - formData.metaDescription.length} characters remaining
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  className="neo-input"
                  placeholder="Comma-separated keywords"
                />
              </div>

              <Button type="submit" className="w-full neo-button bg-neo-primary text-white">
                Update Metadata
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <div className="neo-card">
            <h2 className="text-lg font-medium mb-4">Theme Presets</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(themePresets).map(([key, theme]) => (
                <Button
                  key={key}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    primaryColor: theme.primaryColor,
                    secondaryColor: theme.secondaryColor,
                    accentColor: theme.accentColor,
                    activeTheme: key,
                    primaryFont: theme.font,
                    spacing: theme.spacing,
                  }))}
                  className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                    formData.activeTheme === key ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <span className="text-white">{theme.name}</span>
                  <div className="flex space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.secondaryColor }} />
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.accentColor }} />
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <div className="neo-card">
            <h2 className="text-lg font-medium mb-4">Layout & Spacing</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spacing.container">Container Margin</Label>
                  <Input
                    id="spacing.container"
                    name="spacing.container"
                    value={formData.spacing.container}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      spacing: { ...prev.spacing, container: e.target.value }
                    }))}
                    className="neo-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spacing.headerHeight">Header Height</Label>
                  <Input
                    id="spacing.headerHeight"
                    name="spacing.headerHeight"
                    value={formData.spacing.headerHeight}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      spacing: { ...prev.spacing, headerHeight: e.target.value }
                    }))}
                    className="neo-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spacing.elementGap">Element Gap</Label>
                  <Input
                    id="spacing.elementGap"
                    name="spacing.elementGap"
                    value={formData.spacing.elementGap}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      spacing: { ...prev.spacing, elementGap: e.target.value }
                    }))}
                    className="neo-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spacing.sectionPadding">Section Padding</Label>
                  <Input
                    id="spacing.sectionPadding"
                    name="spacing.sectionPadding"
                    value={formData.spacing.sectionPadding}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      spacing: { ...prev.spacing, sectionPadding: e.target.value }
                    }))}
                    className="neo-input"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-medium">Header Layout</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant={formData.headerConfig.layout === 'default' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, layout: 'default' }
                    }))}
                  >
                    Default
                  </Button>
                  <Button
                    type="button"
                    variant={formData.headerConfig.layout === 'centered' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, layout: 'centered' }
                    }))}
                  >
                    Centered
                  </Button>
                  <Button
                    type="button"
                    variant={formData.headerConfig.layout === 'minimal' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      headerConfig: { ...prev.headerConfig, layout: 'minimal' }
                    }))}
                  >
                    Minimal
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showSearch"
                      checked={formData.headerConfig.showSearch}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        headerConfig: { ...prev.headerConfig, showSearch: e.target.checked }
                      }))}
                    />
                    <Label htmlFor="showSearch">Show Search</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showNotifications"
                      checked={formData.headerConfig.showNotifications}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        headerConfig: { ...prev.headerConfig, showNotifications: e.target.checked }
                      }))}
                    />
                    <Label htmlFor="showNotifications">Show Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showUserProfile"
                      checked={formData.headerConfig.showUserProfile}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        headerConfig: { ...prev.headerConfig, showUserProfile: e.target.checked }
                      }))}
                    />
                    <Label htmlFor="showUserProfile">Show User Profile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="fixedHeader"
                      checked={formData.headerConfig.fixed}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        headerConfig: { ...prev.headerConfig, fixed: e.target.checked }
                      }))}
                    />
                    <Label htmlFor="fixedHeader">Fixed Header</Label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full neo-button bg-neo-primary text-white">
                Apply Layout Settings
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="neo-card">
            <h2 className="text-lg font-medium mb-4">Advanced Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryFont">Primary Font</Label>
                <select
                  id="primaryFont"
                  name="primaryFont"
                  value={formData.primaryFont}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryFont: e.target.value }))}
                  className="w-full p-2 rounded-md border border-gray-300"
                >
                  {formData.customFonts.map(font => (
                    <option key={font.id} value={font.name}>{font.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryFont">Secondary Font</Label>
                <select
                  id="secondaryFont"
                  name="secondaryFont"
                  value={formData.secondaryFont}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondaryFont: e.target.value }))}
                  className="w-full p-2 rounded-md border border-gray-300"
                >
                  {formData.customFonts.map(font => (
                    <option key={font.id} value={font.name}>{font.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  name="footerText"
                  value={formData.footerText}
                  onChange={handleChange}
                  className="neo-input"
                />
              </div>

              <div className="space-y-2">
                <Label>Social Media Links</Label>
                {formData.socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Platform"
                      value={link.platform}
                      onChange={(e) => {
                        const newLinks = [...formData.socialLinks];
                        newLinks[index].platform = e.target.value;
                        setFormData(prev => ({ ...prev, socialLinks: newLinks }));
                      }}
                      className="neo-input w-1/3"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...formData.socialLinks];
                        newLinks[index].url = e.target.value;
                        setFormData(prev => ({ ...prev, socialLinks: newLinks }));
                      }}
                      className="neo-input flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        const newLinks = formData.socialLinks.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, socialLinks: newLinks }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: [...prev.socialLinks, { platform: '', url: '', icon: '' }]
                    }));
                  }}
                >
                  Add Social Link
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Custom Scripts</Label>
                {formData.customScripts.map((script, index) => (
                  <div key={index} className="space-y-2 border p-4 rounded-md">
                    <Input
                      placeholder="Script Name"
                      value={script.name}
                      onChange={(e) => {
                        const newScripts = [...formData.customScripts];
                        newScripts[index].name = e.target.value;
                        setFormData(prev => ({ ...prev, customScripts: newScripts }));
                      }}
                      className="neo-input"
                    />
                    <Textarea
                      value={script.code}
                      onChange={(e) => {
                        const newScripts = [...formData.customScripts];
                        newScripts[index].code = e.target.value;
                        setFormData(prev => ({ ...prev, customScripts: newScripts }));
                      }}
                      className="neo-input min-h-[100px] font-mono"
                      placeholder="// JavaScript code here"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={script.active}
                          onChange={(e) => {
                            const newScripts = [...formData.customScripts];
                            newScripts[index].active = e.target.checked;
                            setFormData(prev => ({ ...prev, customScripts: newScripts }));
                          }}
                        />
                        <Label>Active</Label>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          const newScripts = formData.customScripts.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, customScripts: newScripts }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      customScripts: [...prev.customScripts, {
                        id: Date.now().toString(),
                        name: '',
                        code: '',
                        active: false
                      }]
                    }));
                  }}
                >
                  Add Custom Script
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  name="customCss"
                  value={formData.customCss}
                  onChange={handleChange}
                  className="neo-input min-h-[200px] font-mono"
                  placeholder=".custom-class { /* your styles */ }"
                />
              </div>

              <Button type="submit" className="w-full neo-button bg-neo-primary text-white">
                Apply Advanced Settings
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteCustomizer;
