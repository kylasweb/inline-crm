
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSiteContext } from '@/contexts/SiteContext';
import { 
  LayoutDashboard, Star, PieChart, Users, FileText, Shield, 
  MessageSquare, Presentation, Book, Package, Handshake, 
  Mail, Clock, BarChart2, Link, Flag, GraduationCap, Settings 
} from 'lucide-react';

const moduleData = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Centralized view of key performance indicators, revenue metrics, and sales analytics at a glance. Track your business performance in real-time with customizable widgets.",
    path: "/dashboard"
  },
  {
    icon: Star,
    title: "Lead Management",
    description: "Comprehensive tools to capture, track, and nurture leads through your sales pipeline. Features include lead scoring, automated follow-ups, and conversion analytics.",
    path: "/leads"
  },
  {
    icon: PieChart,
    title: "Opportunity Management",
    description: "Track and manage sales opportunities with detailed pipeline visualization. Monitor deal progress, forecast revenue, and analyze win/loss ratios to optimize your sales process.",
    path: "/opportunities"
  },
  {
    icon: Users,
    title: "Account & Contact Management",
    description: "Maintain complete customer profiles with hierarchical account structures. Track all communications, interactions, and relationship histories in one centralized location.",
    path: "/accounts"
  },
  {
    icon: FileText,
    title: "Quotation Management",
    description: "Create, manage and track quotes and proposals throughout their lifecycle. Includes approval workflows, version control, and integration with ERP systems.",
    path: "/quotations"
  },
  {
    icon: Shield,
    title: "AMC & Licensing",
    description: "Track Annual Maintenance Contracts, software licenses, and warranty information. Get notifications for upcoming renewals and expiration dates to ensure business continuity.",
    path: "/amc"
  },
  {
    icon: MessageSquare,
    title: "Ticket Management",
    description: "Comprehensive helpdesk solution for managing customer support requests. Includes SLA tracking, escalation management, and knowledge base integration.",
    path: "/tickets"
  },
  {
    icon: Presentation,
    title: "Presales Management",
    description: "Manage RFPs, proposals, and proof-of-concepts. Coordinate technical resources and track presales activities to improve win rates.",
    path: "/presales"
  },
  {
    icon: Book,
    title: "Documentation Repository",
    description: "Centralized repository for all business documents including contracts, product specifications, and technical documentation with version control and secure sharing.",
    path: "/documents"
  },
  {
    icon: Package,
    title: "Asset Lifecycle Management",
    description: "Track hardware and software assets throughout their lifecycle. Monitor warranties, depreciation, and maintenance histories for better resource planning.",
    path: "/assets"
  },
  {
    icon: Handshake,
    title: "Vendor & Partner Management",
    description: "Manage relationships with suppliers, vendors, and partners. Track performance, contracts, and engagement metrics to optimize your business ecosystem.",
    path: "/vendors"
  },
  {
    icon: Mail,
    title: "Feedback & Survey System",
    description: "Collect, analyze, and act on customer feedback. Create targeted surveys, track CSAT scores, and identify areas for improvement in your products and services.",
    path: "/feedback"
  },
  {
    icon: Clock,
    title: "SLA & Escalation Tracker",
    description: "Monitor service level agreements and manage escalation processes. Ensure timely resolution of issues and maintain compliance with contractual obligations.",
    path: "/sla"
  },
  {
    icon: BarChart2,
    title: "Revenue Forecasting",
    description: "Advanced analytics and predictive models for sales forecasting. Analyze historical data, track pipeline velocity, and project future revenue streams.",
    path: "/forecasting"
  },
  {
    icon: Link,
    title: "ERP/HRMS/ITSM Integrations",
    description: "Seamless integration with enterprise systems including ERP, HRMS, and ITSM platforms to maintain data consistency and streamline business processes.",
    path: "/integrations"
  },
  {
    icon: Flag,
    title: "Competitor Intelligence",
    description: "Track competitor activities, product offerings, and market positioning. Analyze win/loss data against competitors and develop effective counter-strategies.",
    path: "/competitors"
  },
  {
    icon: GraduationCap,
    title: "Certification & Training Tracker",
    description: "Monitor team skills, certifications, and training progress. Identify skill gaps and plan targeted training programs for technical and sales teams.",
    path: "/certifications"
  },
  {
    icon: Settings,
    title: "Settings & Administration",
    description: "Configure system settings, manage user permissions, and customize workflows. Control access to sensitive data and automate business processes.",
    path: "/settings"
  }
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { siteName } = useSiteContext();

  return (
    <div className="flex flex-col min-h-screen bg-neo-bg">
      {/* Header */}
      <header className="neo-flat px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="neo-convex h-12 w-12 rounded-full flex items-center justify-center">
            <span className="text-neo-primary text-xl font-bold">N</span>
          </div>
          <h1 className="text-2xl font-bold text-neo-text-primary">{siteName}</h1>
        </div>
        <Button
          onClick={() => navigate('/login')}
          className="neo-button bg-neo-bg hover:bg-neo-bg"
        >
          Login
        </Button>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center px-6 md:px-12 py-16 animate-fade-in">
        <div className="md:w-1/2 space-y-6 mb-10 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold text-neo-text-primary">
            Simplify Your IT Business Operations
          </h2>
          <p className="text-xl text-neo-text-secondary">
            {siteName} combines beautiful design with powerful features to streamline your workflow and enhance team productivity.
          </p>
          <div className="flex space-x-4 pt-4">
            <Button 
              onClick={() => navigate('/login')} 
              className="neo-button bg-neo-primary text-white hover:bg-neo-primary/90"
            >
              Get Started
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Demo Available Soon",
                  description: "We're preparing a demo for you to explore all features.",
                })
              }} 
              variant="outline" 
              className="neo-button bg-neo-bg hover:bg-neo-bg"
            >
              Watch Demo
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center">
          <div className="neo-flat p-8 rounded-xl w-full max-w-md">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="neo-flat p-4 rounded-lg w-full">
                  <div className="h-8 flex items-center text-neo-primary font-medium">Dashboard Overview</div>
                  <div className="flex justify-between mt-2">
                    <div className="text-xs text-neo-text-secondary">New Leads</div>
                    <div className="text-xs font-medium">24 Today</div>
                  </div>
                  <div className="neo-pressed h-2 rounded-full mt-1">
                    <div className="h-full bg-neo-primary rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="neo-flat p-4 rounded-lg">
                  <div className="h-24 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-neo-primary">87%</div>
                      <div className="text-xs text-neo-text-secondary">Client Satisfaction</div>
                    </div>
                  </div>
                </div>
                <div className="neo-flat p-4 rounded-lg">
                  <div className="h-24 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-neo-primary">156</div>
                      <div className="text-xs text-neo-text-secondary">Active Tickets</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="neo-flat p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Revenue Forecast</div>
                  <div className="text-xs text-neo-text-secondary">Monthly</div>
                </div>
                <div className="mt-4 flex items-end h-16 space-x-2">
                  {[35, 65, 45, 80, 55, 70, 90, 65, 75].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-neo-primary rounded-sm" 
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-neo-bg py-16 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-4 text-neo-text-primary">Key Features</h2>
        <p className="text-center text-neo-text-secondary max-w-3xl mx-auto mb-12">
          {siteName} offers a comprehensive suite of modules designed specifically for IT companies to manage their entire business lifecycle from lead generation to service delivery and beyond.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {moduleData.slice(0, 6).map((module, index) => (
            <div key={index} className="neo-card p-6 hover:neo-convex transition-shadow duration-300">
              <div className="neo-concave h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <module.icon className="text-neo-primary text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">{module.title}</h3>
              <p className="text-neo-text-secondary mb-4">{module.description}</p>
              <Button 
                onClick={() => navigate(module.path)} 
                variant="outline" 
                size="sm"
                className="text-neo-primary border-neo-primary hover:bg-neo-primary/10"
              >
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* All Modules Section */}
      <section className="bg-gradient-to-b from-neo-bg to-neo-bg/50 py-16 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-4 text-neo-text-primary">Complete Module Suite</h2>
        <p className="text-center text-neo-text-secondary max-w-3xl mx-auto mb-12">
          {siteName} provides an integrated ecosystem of modules that work seamlessly together, designed specifically for the unique needs of IT service providers and technology companies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          {moduleData.map((module, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="neo-concave h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center">
                <module.icon className="text-neo-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{module.title}</h3>
                <p className="text-neo-text-secondary text-sm">{module.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="bg-neo-bg py-16 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-4 text-neo-text-primary">Why Choose {siteName}?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Built for IT Companies",
              description: "Specifically designed for the unique workflows and needs of IT service providers, managed service providers, and technology consultancies."
            },
            {
              title: "Comprehensive Solution",
              description: "One platform for all your business needs - from lead management to service delivery, customer support, and business intelligence."
            },
            {
              title: "Customizable & Flexible",
              description: "Adapt the system to your unique processes with customizable workflows, fields, and reports to match your specific requirements."
            },
            {
              title: "Enhanced Collaboration",
              description: "Break down silos between departments with shared client information, unified communication threads, and integrated workflows."
            },
            {
              title: "Data-Driven Decisions",
              description: "Make informed business decisions with comprehensive analytics, customizable dashboards, and real-time reporting."
            },
            {
              title: "Increased Efficiency",
              description: "Streamline operations, automate routine tasks, and focus on delivering exceptional service to your clients."
            },
          ].map((benefit, index) => (
            <div key={index} className="neo-flat p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-neo-primary">{benefit.title}</h3>
              <p className="text-neo-text-secondary">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-neo-bg to-neo-primary/5 py-20 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-bold mb-4 text-neo-text-primary">Ready to transform your IT business?</h2>
        <p className="text-xl text-neo-text-secondary max-w-3xl mx-auto mb-8">
          Join hundreds of IT companies already using {siteName} to streamline operations, increase productivity, and boost customer satisfaction.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => navigate('/login')} 
            className="neo-button bg-neo-primary text-white hover:bg-neo-primary/90 px-8 py-6"
            size="lg"
          >
            Get Started Now
          </Button>
          <Button 
            onClick={() => {
              toast({
                title: "Contact Request Received",
                description: "Our team will reach out to you shortly to schedule a demo.",
              })
            }} 
            variant="outline" 
            className="neo-button bg-neo-bg hover:bg-neo-bg px-8 py-6"
            size="lg"
          >
            Request a Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="neo-flat px-6 py-12 text-center">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div>
            <h3 className="text-lg font-bold text-neo-primary mb-4">About {siteName}</h3>
            <p className="text-sm text-neo-text-secondary">
              A comprehensive CRM solution designed specifically for IT companies to manage their entire business lifecycle efficiently and effectively.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neo-primary mb-4">Popular Modules</h3>
            <ul className="text-sm text-neo-text-secondary space-y-2">
              <li>Lead Management</li>
              <li>Ticket Management</li>
              <li>Opportunity Tracking</li>
              <li>AMC & Licensing</li>
              <li>Vendor Management</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neo-primary mb-4">Resources</h3>
            <ul className="text-sm text-neo-text-secondary space-y-2">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Knowledge Base</li>
              <li>Tutorials</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neo-primary mb-4">Contact Us</h3>
            <ul className="text-sm text-neo-text-secondary space-y-2">
              <li>support@inlinesyscrm.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Tech Lane, Suite 101</li>
              <li>San Francisco, CA 94107</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-neo-primary/10">
          <p className="text-neo-text-secondary">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
