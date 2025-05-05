
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService, Lead, LeadFormData } from '@/services/leadService';
import { useToast } from '@/hooks/use-toast';
import NeoCard from '@/components/ui/neo-card';
import NeoButton from '@/components/ui/neo-button';
import NeoBadge from '@/components/ui/neo-badge';
import { 
  Plus, Search, Filter, ArrowUp, ArrowDown, 
  AlertTriangle, UserPlus, Mail, Phone, 
  PieChart, BarChart3, Activity
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistance } from 'date-fns';
import { PieChart as ReChartsPieChart, Line } from 'recharts';

// Define chart colors array
const CHART_COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6', '#D946EF'];

const statusColorMap = {
  'New': 'primary',
  'Contacted': 'info',
  'Qualified': 'secondary',
  'Proposal': 'warning',
  'Negotiation': 'success'
};

const LeadManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLeadData, setNewLeadData] = useState<LeadFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: '',
    notes: '',
  });

  // Fetch leads data
  const { data: leadsData, isLoading: leadsLoading, error: leadsError } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await leadService.getLeads();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch leads');
      }
      return response.data;
    }
  });

  // Fetch lead statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['leadStats'],
    queryFn: async () => {
      const response = await leadService.getLeadStats();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch lead statistics');
      }
      return response.data;
    }
  });

  // Create lead mutation
  const createLeadMutation = useMutation({
    mutationFn: (data: LeadFormData) => leadService.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
      setIsCreateDialogOpen(false);
      setNewLeadData({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'New',
        source: '',
        notes: '',
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create lead: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) => 
      leadService.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
      setIsViewDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update lead: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Handle create lead submit
  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLeadMutation.mutate(newLeadData);
  };

  // Filter and sort leads
  const filteredLeads = leadsData?.filter((lead) => {
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === '' || lead.status === selectedStatus;
    const matchesSource = selectedSource === '' || lead.source === selectedSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  }).sort((a, b) => {
    if (sortField === 'createdAt') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortField === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'company') {
      return sortDirection === 'asc'
        ? a.company.localeCompare(b.company)
        : b.company.localeCompare(a.company);
    } else if (sortField === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    } else if (sortField === 'score') {
      return sortDirection === 'asc'
        ? a.score - b.score
        : b.score - a.score;
    }
    return 0;
  }) || [];

  // Extract unique statuses and sources for filters
  const statuses = leadsData ? [...new Set(leadsData.map(lead => lead.status))] : [];
  const sources = leadsData ? [...new Set(leadsData.map(lead => lead.source))] : [];

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // View lead details
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewDialogOpen(true);
  };

  // Helper function to get badge variant
  const getBadgeVariant = (status: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' => {
    return (statusColorMap[status as keyof typeof statusColorMap] || 'default') as 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  };

  if (leadsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="neo-flat p-6 rounded-full animate-pulse">
          <div className="h-12 w-12 border-4 border-neo-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (leadsError) {
    return (
      <div className="text-center py-10">
        <NeoCard className="mx-auto max-w-md">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Leads</h3>
          <p className="text-neo-text-secondary mb-4">
            {leadsError instanceof Error ? leadsError.message : 'Failed to load leads data'}
          </p>
          <NeoButton onClick={() => window.location.reload()}>
            Retry
          </NeoButton>
        </NeoCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Lead Management</h1>
        <NeoButton onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add New Lead
        </NeoButton>
      </div>

      <Tabs defaultValue="leads">
        <TabsList className="neo-flat p-1 mb-6">
          <TabsTrigger value="leads" className="data-[state=active]:neo-pressed">
            Lead List
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:neo-pressed">
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="space-y-6">
          {/* Filters */}
          <NeoCard>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neo-text-secondary h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search leads..."
                  className="neo-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-1 md:flex-initial gap-2 items-center">
                <Filter className="text-neo-text-secondary h-4 w-4" />
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="neo-input w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="neo-input w-[160px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sources</SelectItem>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </NeoCard>

          {/* Leads Table */}
          <NeoCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th 
                      className="pb-3 cursor-pointer" 
                      onClick={() => handleSortChange('name')}
                    >
                      <div className="flex items-center">
                        Name
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="pb-3 cursor-pointer" 
                      onClick={() => handleSortChange('company')}
                    >
                      <div className="flex items-center">
                        Company
                        {sortField === 'company' && (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="pb-3 hidden lg:table-cell">Contact</th>
                    <th 
                      className="pb-3 cursor-pointer" 
                      onClick={() => handleSortChange('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="pb-3 hidden md:table-cell">Source</th>
                    <th 
                      className="pb-3 hidden md:table-cell cursor-pointer" 
                      onClick={() => handleSortChange('score')}
                    >
                      <div className="flex items-center">
                        Score
                        {sortField === 'score' && (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="pb-3 hidden lg:table-cell cursor-pointer" 
                      onClick={() => handleSortChange('createdAt')}
                    >
                      <div className="flex items-center">
                        Created At
                        {sortField === 'createdAt' && (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewLead(lead)}
                    >
                      <td className="py-3">{lead.name}</td>
                      <td className="py-3">{lead.company}</td>
                      <td className="py-3 hidden lg:table-cell">
                        <div className="flex flex-col">
                          <span className="text-xs text-neo-text-secondary flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {lead.email}
                          </span>
                          <span className="text-xs text-neo-text-secondary flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1" /> {lead.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <NeoBadge 
                          variant={getBadgeVariant(lead.status)}
                          size="sm"
                        >
                          {lead.status}
                        </NeoBadge>
                      </td>
                      <td className="py-3 hidden md:table-cell">{lead.source}</td>
                      <td className="py-3 hidden md:table-cell">
                        <div className="flex items-center">
                          <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-neo-primary h-2 rounded-full" 
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                          <span>{lead.score}</span>
                        </div>
                      </td>
                      <td className="py-3 text-neo-text-secondary hidden lg:table-cell">
                        {formatDistance(new Date(lead.createdAt), new Date(), { addSuffix: true })}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-neo-text-secondary">
                        No leads match your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </NeoCard>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          {statsData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NeoCard className="flex flex-col md:col-span-1">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Lead Overview</h3>
                    <Activity className="h-5 w-5 text-neo-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{statsData.totalLeads}</div>
                  <div className="text-neo-text-secondary mb-4">Total Leads</div>
                  <div className="flex items-center neo-pressed px-3 py-2 rounded-lg">
                    <UserPlus className="h-5 w-5 text-neo-primary mr-2" />
                    <div>
                      <div className="font-medium">{statsData.newLeadsToday}</div>
                      <div className="text-xs text-neo-text-secondary">New today</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <div className="text-sm text-neo-text-secondary">Conversion Rate</div>
                      <div className="text-sm font-medium">{statsData.conversionRate}%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-neo-primary h-2 rounded-full" 
                        style={{ width: `${statsData.conversionRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <div className="text-sm text-neo-text-secondary">Avg Response Time</div>
                      <div className="text-sm font-medium">{statsData.averageResponseTime} hrs</div>
                    </div>
                  </div>
                </NeoCard>
                
                <NeoCard className="md:col-span-1">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Leads by Source</h3>
                    <PieChart className="h-5 w-5 text-neo-primary" />
                  </div>
                  <div className="h-64">
                    {statsData.leadsBySource.length > 0 && (
                      <div className="space-y-3">
                        {statsData.leadsBySource.map((item, index) => (
                          <div key={item.source} className="flex flex-col">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{item.source}</span>
                              <span className="text-sm font-medium">{item.count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  width: `${(item.count / statsData.totalLeads) * 100}%`,
                                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                                }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </NeoCard>
                
                <NeoCard className="md:col-span-1">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Leads by Status</h3>
                    <BarChart3 className="h-5 w-5 text-neo-primary" />
                  </div>
                  <div className="h-64">
                    {statsData.leadsByStatus.length > 0 && (
                      <div className="space-y-3">
                        {statsData.leadsByStatus.map((item, index) => (
                          <div key={item.status} className="flex flex-col">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{item.status}</span>
                              <span className="text-sm font-medium">{item.count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  width: `${(item.count / statsData.totalLeads) * 100}%`,
                                  backgroundColor: Object.values(statusColorMap)[index % Object.values(statusColorMap).length] === 'primary' 
                                    ? '#9b87f5' 
                                    : Object.values(statusColorMap)[index % Object.values(statusColorMap).length] === 'secondary'
                                      ? '#7e69ab'
                                      : Object.values(statusColorMap)[index % Object.values(statusColorMap).length] === 'success'
                                        ? 'green'
                                        : Object.values(statusColorMap)[index % Object.values(statusColorMap).length] === 'warning'
                                          ? 'orange'
                                          : Object.values(statusColorMap)[index % Object.values(statusColorMap).length] === 'info'
                                            ? 'blue'
                                            : '#6e59a5'
                                }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </NeoCard>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Lead Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateLeadSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name*</label>
                  <Input
                    id="name"
                    className="neo-input"
                    placeholder="John Doe"
                    value={newLeadData.name}
                    onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">Company*</label>
                  <Input
                    id="company"
                    className="neo-input"
                    placeholder="Acme Inc."
                    value={newLeadData.company}
                    onChange={(e) => setNewLeadData({ ...newLeadData, company: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email*</label>
                  <Input
                    id="email"
                    type="email"
                    className="neo-input"
                    placeholder="john.doe@example.com"
                    value={newLeadData.email}
                    onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone*</label>
                  <Input
                    id="phone"
                    className="neo-input"
                    placeholder="+1 123-456-7890"
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Status*</label>
                  <Select 
                    value={newLeadData.status} 
                    onValueChange={(value) => setNewLeadData({ ...newLeadData, status: value })}
                  >
                    <SelectTrigger className="neo-input">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="source" className="text-sm font-medium">Source*</label>
                  <Select 
                    value={newLeadData.source} 
                    onValueChange={(value) => setNewLeadData({ ...newLeadData, source: value })}
                  >
                    <SelectTrigger className="neo-input">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Cold Call">Cold Call</SelectItem>
                      <SelectItem value="Trade Show">Trade Show</SelectItem>
                      <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <textarea
                  id="notes"
                  className="neo-input w-full h-24 resize-none"
                  placeholder="Add any additional information about this lead..."
                  value={newLeadData.notes}
                  onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <NeoButton type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </NeoButton>
              <NeoButton type="submit" loading={createLeadMutation.isPending}>
                Create Lead
              </NeoButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View/Edit Lead Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <NeoCard className="mb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{selectedLead.name}</h3>
                      <p className="text-neo-text-secondary">{selectedLead.company}</p>
                    </div>
                    <NeoBadge 
                      variant={getBadgeVariant(selectedLead.status)}
                    >
                      {selectedLead.status}
                    </NeoBadge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-neo-text-secondary text-sm">Email</p>
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-neo-primary" />
                        <a href={`mailto:${selectedLead.email}`} className="hover:underline">
                          {selectedLead.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-neo-text-secondary text-sm">Phone</p>
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-neo-primary" />
                        <a href={`tel:${selectedLead.phone}`} className="hover:underline">
                          {selectedLead.phone}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-neo-text-secondary text-sm">Created</p>
                      <p>{new Date(selectedLead.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-neo-text-secondary text-sm">Source</p>
                      <p>{selectedLead.source}</p>
                    </div>
                    <div>
                      <p className="text-neo-text-secondary text-sm">Assigned To</p>
                      <p>{selectedLead.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-neo-text-secondary text-sm">Last Contact</p>
                      <p>
                        {selectedLead.lastContact 
                          ? formatDistance(new Date(selectedLead.lastContact), new Date(), { addSuffix: true })
                          : 'Not contacted yet'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-neo-text-secondary text-sm mb-1">Notes</p>
                    <div className="neo-pressed p-3 rounded-lg">
                      {selectedLead.notes || 'No notes available for this lead.'}
                    </div>
                  </div>
                </NeoCard>
              </div>
              
              <div className="md:col-span-1">
                <NeoCard className="mb-4">
                  <h4 className="font-medium mb-3">Lead Score</h4>
                  <div className="flex justify-center mb-2">
                    <div className="neo-convex h-24 w-24 rounded-full flex items-center justify-center">
                      <div className="text-2xl font-bold text-neo-primary">
                        {selectedLead.score}
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-neo-text-secondary">
                    {selectedLead.score >= 75 
                      ? 'High-value lead. Follow up immediately!'
                      : selectedLead.score >= 50
                        ? 'Promising lead. Prioritize contact.'
                        : 'Requires nurturing. Add to campaign.'}
                  </div>
                </NeoCard>
                
                <NeoCard>
                  <h4 className="font-medium mb-3">Update Status</h4>
                  <div className="space-y-3">
                    {['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation'].map(status => (
                      <NeoButton 
                        key={status}
                        variant={selectedLead.status === status ? 'primary' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => {
                          if (selectedLead.status !== status) {
                            updateLeadMutation.mutate({
                              id: selectedLead.id,
                              data: { status }
                            });
                          }
                        }}
                        loading={updateLeadMutation.isPending && selectedLead.status !== status}
                        disabled={updateLeadMutation.isPending}
                      >
                        {status}
                      </NeoButton>
                    ))}
                  </div>
                </NeoCard>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManagement;
