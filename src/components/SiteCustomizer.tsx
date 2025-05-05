
import React, { useState } from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const SiteCustomizer: React.FC = () => {
  const { 
    siteName,
    primaryColor,
    secondaryColor,
    accentColor,
    updateSiteName,
    updatePrimaryColor,
    updateSecondaryColor,
    updateAccentColor,
    resetToDefaults
  } = useSiteContext();
  
  const [formData, setFormData] = useState({
    siteName,
    primaryColor,
    secondaryColor,
    accentColor
  });
  
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteName(formData.siteName);
    updatePrimaryColor(formData.primaryColor);
    updateSecondaryColor(formData.secondaryColor);
    updateAccentColor(formData.accentColor);
    
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
      accentColor: '#6e59a5'
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="neo-card">
          <h2 className="text-lg font-medium mb-4">Customize Your CRM</h2>
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
    </div>
  );
};

export default SiteCustomizer;
