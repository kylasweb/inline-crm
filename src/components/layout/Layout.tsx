import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSiteContext } from '@/contexts/SiteContext';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { logo, footerText } = useSiteContext();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-neo-bg">
      {/* Sidebar */}
      {(sidebarOpen || !isMobile) && (
        <Sidebar isMobile={isMobile} toggleSidebar={toggleSidebar} />
      )}

      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="neo-flat px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {logo && (
                <img 
                  src={logo} 
                  alt="Company Logo" 
                  className="h-8 w-auto"
                />
              )}
              <span className="text-sm text-neo-text-secondary">
                {footerText}
              </span>
            </div>
            <div className="text-sm text-neo-text-secondary">
              Build v1.0.0
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
