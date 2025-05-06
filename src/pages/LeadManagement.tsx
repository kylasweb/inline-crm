import React, { useCallback, useState } from 'react';
import { useLeadsStore } from '@/stores/leads.store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis 
} from 'recharts';
import { fetchLeads, fetchLeadStats } from '@/services/leadService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NeoCard from '@/components/ui/neo-card';
import NeoBadge from '@/components/ui/neo-badge';
import { ArrowUpRight, FileText, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange as ReactDayPickerDateRange } from 'react-day-picker';
import LeadFormDialog from '@/components/leads/LeadFormDialog';

// Define chart colors
const CHART_COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

// Define props interface for LeadManagement
interface LeadManagementProps {
  filter?: string;
  activeTab?: string;
}

type DateRange = ReactDayPickerDateRange;

const LeadManagement: React.FC<LeadManagementProps> = ({ filter, activeTab = "list" }) => {
  const { setCreateDialogOpen } = useLeadsStore();
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [leadSource, setLeadSource] = useState('All Sources');
  const [leadStatus, setLeadStatus] = useState('All Statuses');

  const handleLeadSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    queryClient.invalidateQueries({ queryKey: ['leadStats'] });
  }, [queryClient]);

  const { data: leads, isLoading: leadsLoading, error: leadsError } = useQuery({
    queryKey: ['leads', dateRange, searchQuery, leadSource, leadStatus, filter, activeTab],
    queryFn: () => fetchLeads(dateRange, searchQuery, leadSource, leadStatus),
  });

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['leadStats', dateRange],
    queryFn: () => fetchLeadStats(dateRange),
  });

  if (leadsError || statsError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <NeoCard className="p-6 text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
          <p className="text-neo-text-secondary mb-4">
            {leadsError ? 'Failed to load leads data.' : 'Failed to load statistics data.'}
          </p>
          <Button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['leads'] });
              queryClient.invalidateQueries({ queryKey: ['leadStats'] });
            }}
            className="neo-button"
          >
            Retry
          </Button>
        </NeoCard>
      </div>
    );
  }

  if (leadsLoading || statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="neo-flat h-24 w-24 rounded-full flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-neo-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-neo-primary">Loading lead data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lead Management</h1>
          <p className="text-neo-text-secondary">Track and manage incoming leads</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="neo-button" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
          <Button variant="outline" className="neo-flat">
            <FileText className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Total Leads</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{stats?.totalLeads}</p>
          <p className="text-xs text-neo-text-secondary mt-1">All leads in the system</p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">New Leads</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{stats?.newLeads}</p>
          <p className="text-xs text-neo-text-secondary mt-1">Leads created in the last 30 days</p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Qualified Leads</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{stats?.qualifiedLeads}</p>
          <p className="text-xs text-neo-text-secondary mt-1">Leads that meet qualification criteria</p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Conversion Rate</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{stats?.conversionRate}%</p>
          <p className="text-xs text-neo-text-secondary mt-1">Leads converted into opportunities</p>
        </NeoCard>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} className="neo-flat p-1 rounded-lg">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="list">Lead List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neo-text-secondary h-4 w-4" />
              <Input
                placeholder="Search leads..."
                className="pl-10 neo-flat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <DatePickerWithRange
                date={dateRange}
                setDate={setDateRange}
              />

              <Select value={leadSource} onValueChange={setLeadSource}>
                <SelectTrigger className="w-36 neo-flat">
                  <SelectValue placeholder="Filter by Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Sources">All Sources</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Advertisement">Advertisement</SelectItem>
                </SelectContent>
              </Select>

              <Select value={leadStatus} onValueChange={setLeadStatus}>
                <SelectTrigger className="w-36 neo-flat">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Statuses">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="neo-flat">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Lead List */}
          <div className="overflow-x-auto neo-flat rounded-lg p-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neo-border">
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Source</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-neo-text-secondary">
                        <FileText className="h-12 w-12 mb-2 opacity-50" />
                        <p>No leads found</p>
                        <p className="text-sm">Try adjusting your filters or add a new lead</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads?.map((lead) => (
                    <tr key={lead.id} className="border-b border-neo-border hover:bg-neo-bg/50">
                      <td className="py-3 px-4">{lead.name}</td>
                      <td className="py-3 px-4">{lead.email}</td>
                      <td className="py-3 px-4">{lead.phone}</td>
                      <td className="py-3 px-4">{lead.source}</td>
                      <td className="py-3 px-4">
                        <NeoBadge variant="primary">{lead.status}</NeoBadge>
                      </td>
                      <td className="py-3 px-4">{format(new Date(lead.createdAt), 'MMM dd, yyyy')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeoCard className="p-6">
              <h3 className="font-medium mb-4">Lead Distribution by Source</h3>
              <div className="h-64">
                {(!stats?.leadsBySource || stats.leadsBySource.length === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-neo-text-secondary">
                    <PieChart className="h-12 w-12 mb-2 opacity-50" />
                    <p>No source distribution data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.leadsBySource}
                        dataKey="count"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => entry.source}
                      >
                        {stats.leadsBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </NeoCard>

            <NeoCard className="p-6">
              <h3 className="font-medium mb-4">Lead Trend Over Time</h3>
              <div className="h-64">
                {(!stats?.leadTrend || stats.leadTrend.length === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-neo-text-secondary">
                    <BarChart className="h-12 w-12 mb-2 opacity-50" />
                    <p>No trend data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.leadTrend}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="New Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </NeoCard>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="p-4">
          <NeoCard className="p-6 text-center">
            <h3 className="font-medium mb-4">Lead Automation</h3>
            <p className="text-neo-text-secondary mb-4">
              Automate lead nurturing and follow-up processes to improve conversion rates.
            </p>
            <Button className="neo-button">Configure Automation</Button>
          </NeoCard>
        </TabsContent>

        <TabsContent value="settings" className="p-4">
          <NeoCard className="p-6 text-center">
            <h3 className="font-medium mb-4">Lead Settings</h3>
            <p className="text-neo-text-secondary mb-4">
              Customize lead fields, sources, and statuses to match your business needs.
            </p>
            <Button className="neo-button">Customize Settings</Button>
          </NeoCard>
        </TabsContent>
      </Tabs>

      <LeadFormDialog />
    </div>
  );
};

export default LeadManagement;
