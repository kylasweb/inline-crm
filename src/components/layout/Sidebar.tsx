
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, PieChart, Calendar, 
  Mail, Settings, Tag, Database, Clock,
  Briefcase, Star, MessageSquare, ListCheck, 
  Shield, Book, Presentation, Package, 
  Handshake, BarChart2, Link, Flag, GraduationCap
} from 'lucide-react';

// Define all menu items with their sub-items
const menuItems = [
  { 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/', 
    subItems: []
  },
  { 
    name: 'Lead Management', 
    icon: Star, 
    path: '/leads', 
    subItems: [
      { name: 'All Leads', path: '/leads' },
      { name: 'New Leads', path: '/leads/new' },
      { name: 'Lead Analytics', path: '/leads/analytics' }
    ]
  },
  { 
    name: 'Opportunities', 
    icon: PieChart, 
    path: '/opportunities', 
    subItems: [
      { name: 'Pipeline View', path: '/opportunities' },
      { name: 'Deal Tracking', path: '/opportunities/deals' },
      { name: 'Forecast', path: '/opportunities/forecast' }
    ]
  },
  { 
    name: 'Accounts', 
    icon: Users, 
    path: '/accounts', 
    subItems: [
      { name: 'All Accounts', path: '/accounts' },
      { name: 'Contacts', path: '/accounts/contacts' },
      { name: 'Account Hierarchy', path: '/accounts/hierarchy' }
    ]
  },
  { 
    name: 'Quotations', 
    icon: FileText, 
    path: '/quotations', 
    subItems: [
      { name: 'All Quotes', path: '/quotations' },
      { name: 'Approvals', path: '/quotations/approvals' },
      { name: 'Templates', path: '/quotations/templates' }
    ]
  },
  { 
    name: 'AMC & Licensing', 
    icon: Shield, 
    path: '/amc', 
    subItems: [
      { name: 'License Tracker', path: '/amc/licenses' },
      { name: 'Renewals', path: '/amc/renewals' },
      { name: 'Contract Archive', path: '/amc/contracts' }
    ]
  },
  { 
    name: 'Tickets', 
    icon: MessageSquare, 
    path: '/tickets', 
    subItems: [
      { name: 'Open Tickets', path: '/tickets' },
      { name: 'My Tickets', path: '/tickets/my-tickets' },
      { name: 'Knowledge Base', path: '/tickets/kb' }
    ]
  },
  { 
    name: 'Presales', 
    icon: Presentation, 
    path: '/presales', 
    subItems: [
      { name: 'RFPs', path: '/presales/rfps' },
      { name: 'Proposals', path: '/presales/proposals' },
      { name: 'POCs', path: '/presales/poc' }
    ]
  },
  { 
    name: 'Documentation', 
    icon: Book, 
    path: '/documents', 
    subItems: [
      { name: 'All Documents', path: '/documents' },
      { name: 'Templates', path: '/documents/templates' },
      { name: 'Version History', path: '/documents/versions' }
    ]
  },
  { 
    name: 'Assets', 
    icon: Package, 
    path: '/assets', 
    subItems: [
      { name: 'Asset Registry', path: '/assets' },
      { name: 'Warranties', path: '/assets/warranties' },
      { name: 'Asset Movement', path: '/assets/movement' }
    ]
  },
  { 
    name: 'Vendors', 
    icon: Handshake, 
    path: '/vendors', 
    subItems: [
      { name: 'All Vendors', path: '/vendors' },
      { name: 'Partner Program', path: '/vendors/partners' },
      { name: 'Performance', path: '/vendors/performance' }
    ]
  },
  { 
    name: 'Feedback', 
    icon: Mail, 
    path: '/feedback', 
    subItems: [
      { name: 'Surveys', path: '/feedback/surveys' },
      { name: 'CSAT Results', path: '/feedback/csat' },
      { name: 'Action Items', path: '/feedback/actions' }
    ]
  },
  { 
    name: 'SLA Tracker', 
    icon: Clock, 
    path: '/sla', 
    subItems: [
      { name: 'SLA Dashboard', path: '/sla' },
      { name: 'Escalations', path: '/sla/escalations' },
      { name: 'SLA Config', path: '/sla/config' }
    ]
  },
  { 
    name: 'Forecasting', 
    icon: BarChart2, 
    path: '/forecasting', 
    subItems: [
      { name: 'Revenue Forecast', path: '/forecasting' },
      { name: 'Risk Analysis', path: '/forecasting/risk' },
      { name: 'Historical Data', path: '/forecasting/history' }
    ]
  },
  { 
    name: 'Integrations', 
    icon: Link, 
    path: '/integrations', 
    subItems: [
      { name: 'Connected Systems', path: '/integrations' },
      { name: 'Sync Status', path: '/integrations/sync' },
      { name: 'API Settings', path: '/integrations/api' }
    ]
  },
  { 
    name: 'Competitor Intel', 
    icon: Flag, 
    path: '/competitors', 
    subItems: [
      { name: 'Competitor Database', path: '/competitors' },
      { name: 'Competitive Analysis', path: '/competitors/analysis' },
      { name: 'Win/Loss Stats', path: '/competitors/stats' }
    ]
  },
  { 
    name: 'Certifications', 
    icon: GraduationCap, 
    path: '/certifications', 
    subItems: [
      { name: 'Team Skills', path: '/certifications' },
      { name: 'Upcoming Exams', path: '/certifications/exams' },
      { name: 'Training Calendar', path: '/certifications/training' }
    ]
  },
  { 
    name: 'Settings', 
    icon: Settings, 
    path: '/settings', 
    subItems: [
      { name: 'User Profiles', path: '/settings/users' },
      { name: 'System Config', path: '/settings/config' },
      { name: 'Workflows', path: '/settings/workflows' }
    ]
  }
];

const Sidebar: React.FC<{ isMobile: boolean; toggleSidebar: () => void }> = ({ isMobile, toggleSidebar }) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName) 
        : [...prev, itemName]
    );
  };

  return (
    <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : 'relative'} w-64 h-full overflow-y-auto neo-flat p-4`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-neo-primary">Inline SysCRM</h1>
        {isMobile && (
          <button onClick={toggleSidebar} className="neo-button p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name} className="relative">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => 
                      `flex items-center py-2 px-4 rounded-lg transition-all duration-200 flex-grow ${
                        isActive 
                          ? 'text-neo-primary neo-pressed' 
                          : 'text-neo-text-secondary hover:text-neo-primary'
                      }`
                    }
                    onClick={isMobile && item.subItems.length === 0 ? toggleSidebar : undefined}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </NavLink>
                  
                  {item.subItems.length > 0 && (
                    <button 
                      className="w-8 h-8 flex items-center justify-center mr-1 rounded-md hover:bg-neo-bg-accent"
                      onClick={() => toggleExpand(item.name)}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        className={`h-4 w-4 transition-transform ${expandedItems.includes(item.name) ? 'rotate-180' : ''}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Submenu */}
                {item.subItems.length > 0 && expandedItems.includes(item.name) && (
                  <ul className="ml-7 mt-1 space-y-1 pl-2 border-l border-neo-border">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <NavLink 
                          to={subItem.path} 
                          className={({ isActive }) => 
                            `block py-1 px-3 rounded-md text-sm transition-all ${
                              isActive 
                                ? 'text-neo-primary neo-flat' 
                                : 'text-neo-text-secondary hover:text-neo-primary'
                            }`
                          }
                          onClick={isMobile ? toggleSidebar : undefined}
                        >
                          {subItem.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
