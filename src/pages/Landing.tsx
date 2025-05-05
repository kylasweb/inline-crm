
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="flex flex-col min-h-screen bg-neo-bg">
      {/* Header */}
      <header className="neo-flat px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="neo-convex h-12 w-12 rounded-full flex items-center justify-center">
            <span className="text-neo-primary text-xl font-bold">N</span>
          </div>
          <h1 className="text-2xl font-bold text-neo-text-primary">NeoLytic CRM</h1>
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
            NeoLytic CRM combines beautiful design with powerful features to streamline your workflow.
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
        <h2 className="text-3xl font-bold text-center mb-12 text-neo-text-primary">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Lead Management",
              description: "Track and manage leads through your sales pipeline with intuitive tools."
            },
            {
              title: "Ticket System",
              description: "Resolve customer issues efficiently with our comprehensive ticketing system."
            },
            {
              title: "Opportunity Tracking",
              description: "Never miss a sales opportunity with our advanced tracking features."
            }
          ].map((feature, index) => (
            <div key={index} className="neo-card p-6 hover:neo-convex transition-shadow duration-300">
              <div className="neo-concave h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-neo-primary text-xl font-bold">{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-neo-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="neo-flat px-6 py-8 text-center text-neo-text-secondary">
        <p>© 2025 NeoLytic CRM. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
