
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, FileText, PieChart, Calendar, 
  Mail, Settings, Tag, Database, Clock,
  Briefcase, Star, MessageSquare, ListCheck, 
  Shield, Book, LayoutDashboard
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Lead Management', icon: Star, path: '/leads' },
  { name: 'Opportunities', icon: PieChart, path: '/opportunities' },
  { name: 'Accounts', icon: Users, path: '/accounts' },
  { name: 'Quotations', icon: FileText, path: '/quotations' },
  { name: 'AMC & Licensing', icon: Shield, path: '/amc' },
  { name: 'Tickets', icon: MessageSquare, path: '/tickets' },
  { name: 'Presales', icon: ListCheck, path: '/presales' },
  { name: 'Documentation', icon: Book, path: '/documents' },
  { name: 'Assets', icon: Tag, path: '/assets' },
  { name: 'Vendors', icon: Briefcase, path: '/vendors' },
  { name: 'Feedback', icon: Mail, path: '/feedback' },
  { name: 'SLA Tracker', icon: Clock, path: '/sla' },
  { name: 'Forecasting', icon: Calendar, path: '/forecasting' },
  { name: 'Integrations', icon: Database, path: '/integrations' },
  { name: 'Settings', icon: Settings, path: '/settings' }
];

const Sidebar: React.FC<{ isMobile: boolean; toggleSidebar: () => void }> = ({ isMobile, toggleSidebar }) => {
  return (
    <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : 'relative'} w-64 h-full overflow-y-auto neo-flat p-4`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-neo-primary">NeoTech CRM</h1>
        {isMobile && (
          <button onClick={toggleSidebar} className="neo-button p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'text-neo-primary neo-pressed' 
                      : 'text-neo-text-secondary hover:text-neo-primary'
                  }`
                }
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
