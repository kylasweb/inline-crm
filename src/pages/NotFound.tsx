
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NeoCard from "@/components/ui/neo-card";
import NeoButton from "@/components/ui/neo-button";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neo-bg">
      <NeoCard className="max-w-lg mx-auto text-center">
        <AlertTriangle className="h-16 w-16 mx-auto text-neo-primary mb-6" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-neo-text-secondary mb-6">Oops! Page not found</p>
        <p className="text-neo-text-secondary mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <NeoButton className="inline-flex items-center" onClick={() => window.location.href = "/"}>
          <Home className="h-5 w-5 mr-2" />
          Return to Home
        </NeoButton>
      </NeoCard>
    </div>
  );
};

export default NotFound;
