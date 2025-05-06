import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Documentation from "./pages/Documentation";
import Dashboard from "./pages/Dashboard";
import LeadManagement from "./pages/LeadManagement";
import OpportunityManagement from "./pages/OpportunityManagement";
import AccountManagement from "./pages/AccountManagement";
import AssignmentManagement from "./pages/AssignmentManagement";
import Tickets from "./pages/Tickets";
import Quotations from "./pages/Quotations";
import NotFound from "./pages/NotFound";
import ComingSoon from "./components/ComingSoon";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import { SiteProvider } from "./contexts/SiteContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000 // 10 minutes
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SiteProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected pages */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/leads" element={<Layout><LeadManagement /></Layout>} />
            <Route path="/opportunities" element={<Layout><OpportunityManagement /></Layout>} />
            <Route path="/tickets" element={<Layout><Tickets /></Layout>} />
            <Route path="/tickets/my-tickets" element={<Layout><Tickets /></Layout>} />
            <Route path="/tickets/kb" element={<Layout><ComingSoon name="Knowledge Base" /></Layout>} />
            <Route path="/leads/new" element={<Layout><LeadManagement filter="new" /></Layout>} />
            <Route path="/leads/analytics" element={<Layout><LeadManagement activeTab="stats" /></Layout>} />
            <Route path="/opportunities/deals" element={<Layout><OpportunityManagement activeTab="list" /></Layout>} />
            <Route path="/opportunities/forecast" element={<Layout><OpportunityManagement activeTab="forecasting" /></Layout>} />
            
            {/* The rest of the modules would be added here */}
            <Route path="/accounts" element={<Layout><AccountManagement /></Layout>} />
            <Route path="/accounts/list" element={<Layout><AccountManagement activeTab="list" /></Layout>} />
            <Route path="/accounts/analytics" element={<Layout><AccountManagement activeTab="analytics" /></Layout>} />
            <Route path="/quotations" element={<Layout><Quotations /></Layout>} />
            <Route path="/assignment" element={<Layout><AssignmentManagement /></Layout>} />
            <Route path="/amc/*" element={<Layout><ComingSoon name="AMC & Licensing" /></Layout>} />
            <Route path="/presales/*" element={<Layout><ComingSoon name="Presales Management" /></Layout>} />
            <Route path="/documents" element={<Layout><Documentation /></Layout>} />
            <Route path="/assets/*" element={<Layout><ComingSoon name="Asset Lifecycle" /></Layout>} />
            <Route path="/vendors/*" element={<Layout><ComingSoon name="Vendor & Partner Management" /></Layout>} />
            <Route path="/feedback/*" element={<Layout><ComingSoon name="Feedback & Survey System" /></Layout>} />
            <Route path="/sla/*" element={<Layout><ComingSoon name="SLA & Escalation Tracker" /></Layout>} />
            <Route path="/forecasting/*" element={<Layout><ComingSoon name="Revenue Forecasting" /></Layout>} />
            <Route path="/integrations/*" element={<Layout><ComingSoon name="ERP/HRMS/ITSM Integrations" /></Layout>} />
            <Route path="/competitors/*" element={<Layout><ComingSoon name="Competitor Intelligence" /></Layout>} />
            <Route path="/certifications/*" element={<Layout><ComingSoon name="Certification & Training Tracker" /></Layout>} />
            <Route path="/settings/*" element={<Layout><ComingSoon name="Settings" /></Layout>} />
            <Route path="/customizer" element={<Layout><ComingSoon name="Site Customizer" /></Layout>} />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SiteProvider>
  </QueryClientProvider>
);

export default App;
