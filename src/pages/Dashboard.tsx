
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import NeoCard from '@/components/ui/neo-card';
import NeoBadge from '@/components/ui/neo-badge';
import { TrendingUp, TrendingDown, Clock, CheckSquare, AlertTriangle, Palette } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { formatDistance } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SiteCustomizer from '@/components/SiteCustomizer';

const COLORS = ['#9b87f5', '#7e69ab', '#6e59a5', '#d6bcfa', '#b794f4'];

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const response = await dashboardService.getDashboardData();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dashboard data');
      }
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="neo-flat p-6 rounded-full animate-pulse">
          <div className="h-12 w-12 border-4 border-neo-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-10">
        <NeoCard className="mx-auto max-w-md">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Dashboard</h3>
          <p className="text-neo-text-secondary mb-4">
            {error instanceof Error ? error.message : 'Failed to load dashboard data'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="neo-button text-neo-primary"
          >
            Retry
          </button>
        </NeoCard>
      </div>
    );
  }

  const { summary, revenueStats, ticketStats, pipelineStats, recentActivity } = data;

  const percentChange = ((revenueStats.thisMonth - revenueStats.lastMonth) / revenueStats.lastMonth * 100).toFixed(1);
  const isPositiveChange = revenueStats.thisMonth >= revenueStats.lastMonth;

  return (
    <Tabs defaultValue="overview" className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <TabsList className="neo-flat">
            <TabsTrigger value="overview" className="data-[state=active]:neo-pressed">Overview</TabsTrigger>
            <TabsTrigger value="customizer" className="data-[state=active]:neo-pressed">
              <Palette className="h-4 w-4 mr-2" />
              Customizer
            </TabsTrigger>
          </TabsList>
          <div className="text-sm text-neo-text-secondary">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
      
      <TabsContent value="overview" className="space-y-6 mt-0">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NeoCard className="flex flex-col">
            <div className="text-neo-text-secondary mb-2">New Leads</div>
            <div className="text-3xl font-bold mb-2">{summary.newLeads}</div>
            <div className="mt-auto">
              <NeoBadge variant="primary" size="sm">Today</NeoBadge>
            </div>
          </NeoCard>
          
          <NeoCard className="flex flex-col">
            <div className="text-neo-text-secondary mb-2">Open Opportunities</div>
            <div className="text-3xl font-bold mb-2">{summary.openOpportunities}</div>
            <div className="mt-auto">
              <NeoBadge variant="secondary" size="sm">Active</NeoBadge>
            </div>
          </NeoCard>
          
          <NeoCard className="flex flex-col">
            <div className="text-neo-text-secondary mb-2">Pending Tickets</div>
            <div className="text-3xl font-bold mb-2">{summary.pendingTickets}</div>
            <div className="mt-auto">
              <NeoBadge variant="warning" size="sm">Requires Attention</NeoBadge>
            </div>
          </NeoCard>
          
          <NeoCard className="flex flex-col">
            <div className="text-neo-text-secondary mb-2">Upcoming Renewals</div>
            <div className="text-3xl font-bold mb-2">{summary.upcomingRenewals}</div>
            <div className="mt-auto">
              <NeoBadge variant="info" size="sm">Next 30 Days</NeoBadge>
            </div>
          </NeoCard>
        </div>
        
        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <NeoCard className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Revenue Trend</h2>
              <div className="flex items-center">
                <div className={`flex items-center ${isPositiveChange ? 'text-green-500' : 'text-red-500'} mr-2`}>
                  {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  <span>{Math.abs(Number(percentChange))}%</span>
                </div>
                <span className="text-neo-text-secondary text-sm">vs last month</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueStats.quarterly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${value/1000}k`} 
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{ backgroundColor: '#f1f0fb', borderRadius: '8px', border: 'none', boxShadow: '3px 3px 6px #d3d0e2, -3px -3px 6px #ffffff' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Monthly Revenue"
                    stroke="#9b87f5" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </NeoCard>
          
          <NeoCard>
            <h2 className="text-lg font-medium mb-4">Pipeline Value</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineStats.stages}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="stage"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pipelineStats.stages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}
                    contentStyle={{ backgroundColor: '#f1f0fb', borderRadius: '8px', border: 'none', boxShadow: '3px 3px 6px #d3d0e2, -3px -3px 6px #ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <div className="text-neo-text-secondary">Win Rate</div>
                <div className="font-medium">{pipelineStats.winRate}%</div>
              </div>
              <div>
                <div className="text-neo-text-secondary">Avg Deal Size</div>
                <div className="font-medium">${pipelineStats.averageDealSize.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-neo-text-secondary">Sales Cycle</div>
                <div className="font-medium">{pipelineStats.salesCycle} days</div>
              </div>
            </div>
          </NeoCard>
        </div>
        
        {/* Ticket Status and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <NeoCard className="lg:col-span-1">
            <h2 className="text-lg font-medium mb-4">Ticket Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ticketStats.priorityDistribution}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="priority" type="category" width={80} />
                  <Tooltip 
                    formatter={(value) => [`${value} tickets`, 'Count']}
                    contentStyle={{ backgroundColor: '#f1f0fb', borderRadius: '8px', border: 'none', boxShadow: '3px 3px 6px #d3d0e2, -3px -3px 6px #ffffff' }}
                  />
                  <Bar dataKey="count" fill="#9b87f5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <div className="text-neo-text-secondary">Response Time</div>
                <div className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-neo-primary" />
                  {ticketStats.responseTimeAvg} hrs
                </div>
              </div>
              <div>
                <div className="text-neo-text-secondary">Resolution Time</div>
                <div className="font-medium flex items-center">
                  <CheckSquare className="h-4 w-4 mr-1 text-neo-primary" />
                  {ticketStats.resolutionTimeAvg} hrs
                </div>
              </div>
            </div>
          </NeoCard>
          
          <NeoCard className="lg:col-span-2">
            <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="neo-flat p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div className="font-medium">{activity.subject}</div>
                    <NeoBadge 
                      variant={
                        activity.type === 'lead' ? 'primary' : 
                        activity.type === 'opportunity' ? 'secondary' : 
                        activity.type === 'ticket' ? 'info' : 
                        'default'
                      } 
                      size="sm"
                    >
                      {activity.type}
                    </NeoBadge>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <div className="text-neo-text-secondary">{activity.user}</div>
                    <div className="text-neo-text-secondary">
                      {formatDistance(new Date(activity.timestamp), new Date(), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </NeoCard>
        </div>
      </TabsContent>
      
      <TabsContent value="customizer" className="mt-0">
        <SiteCustomizer />
      </TabsContent>
    </Tabs>
  );
};

export default Dashboard;
