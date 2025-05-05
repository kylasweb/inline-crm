
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import LeadManagement from "./pages/LeadManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/leads" element={<Layout><LeadManagement /></Layout>} />
          
          {/* The rest of the modules would be added here */}
          <Route path="/opportunities" element={<Layout><ComingSoon name="Opportunity & Deal Management" /></Layout>} />
          <Route path="/accounts" element={<Layout><ComingSoon name="Account & Contact Management" /></Layout>} />
          <Route path="/quotations" element={<Layout><ComingSoon name="Quotation Management" /></Layout>} />
          <Route path="/amc" element={<Layout><ComingSoon name="AMC & Licensing" /></Layout>} />
          <Route path="/tickets" element={<Layout><ComingSoon name="Ticketing System" /></Layout>} />
          <Route path="/presales" element={<Layout><ComingSoon name="Presales Management" /></Layout>} />
          <Route path="/documents" element={<Layout><ComingSoon name="Documentation Repository" /></Layout>} />
          <Route path="/assets" element={<Layout><ComingSoon name="Asset Lifecycle" /></Layout>} />
          <Route path="/vendors" element={<Layout><ComingSoon name="Vendor & Partner Management" /></Layout>} />
          <Route path="/feedback" element={<Layout><ComingSoon name="Feedback & Survey System" /></Layout>} />
          <Route path="/sla" element={<Layout><ComingSoon name="SLA & Escalation Tracker" /></Layout>} />
          <Route path="/forecasting" element={<Layout><ComingSoon name="Revenue Forecasting" /></Layout>} />
          <Route path="/integrations" element={<Layout><ComingSoon name="ERP/HRMS/ITSM Integrations" /></Layout>} />
          <Route path="/settings" element={<Layout><ComingSoon name="Settings" /></Layout>} />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Temporary component for modules that aren't implemented yet
const ComingSoon = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center h-[70vh]">
    <div className="neo-flat h-24 w-24 rounded-full flex items-center justify-center mb-6">
      <div className="neo-pressed h-16 w-16 rounded-full flex items-center justify-center">
        <div className="text-neo-primary text-2xl font-bold">!</div>
      </div>
    </div>
    <h2 className="text-xl font-bold mb-2">{name}</h2>
    <p className="text-neo-text-secondary mb-6">This module is coming soon!</p>
    <p className="text-center max-w-md text-sm">
      We're currently working on implementing this feature. 
      Please check back later or explore the Dashboard and Lead Management modules which are already available.
    </p>
  </div>
);

export default App;
