
import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSiteContext } from '@/contexts/SiteContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { siteName } = useSiteContext();
  
  return (
    <header className="neo-flat px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="neo-button mr-4 md:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neo-text-secondary h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="neo-pressed pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-neo-primary/30"
          />
        </div>
      </div>
      
      <div className="hidden md:block text-lg font-bold text-neo-primary">{siteName}</div>
      
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="neo-button relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-neo-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">3</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>You have 3 unread notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="neo-flat h-10 w-10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-neo-primary" />
                </div>
                <div className="hidden md:block">
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-neo-text-secondary">Admin</p>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>User Profile & Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default Header;
