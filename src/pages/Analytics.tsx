import React from 'react';
import Layout from '../components/layout/Layout';
import Dashboard from '../components/analytics/Dashboard.tsx';

export const Analytics: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          </div>
          <Dashboard />
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;