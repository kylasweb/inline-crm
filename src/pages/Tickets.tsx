import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { AlertCircle, ArrowUpRight, Check, Clock, Filter, Plus, Search, SlidersHorizontal } from 'lucide-react';
import NeoCard from '@/components/ui/neo-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { formatDistance } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

// Define chart colors
const CHART_COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

// API calls using our mock API service
import { fetchData, postData } from '@/services/api';

const fetchTickets = async (): Promise<Ticket[]> => {
  const response = await fetchData<Ticket[]>('/tickets');
  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch tickets');
  }
  return response.data!;
};

const fetchTicketStats = async (): Promise<TicketStats> => {
  const response = await fetchData<TicketStats>('/tickets/stats');
  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch ticket statistics');
  }
  return response.data!;
};

const createTicket = async (ticket: Partial<Ticket>): Promise<Ticket> => {
  const response = await postData<Ticket>('/tickets', ticket);
  if (!response.success) {
    throw new Error(response.error || 'Failed to create ticket');
  }
  return response.data!;
};

// Types
interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Pending';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  type: 'Bug' | 'Feature' | 'Support' | 'Question' | 'Other';
  client: string;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  tags: string[];
  channel: 'Email' | 'Phone' | 'Web' | 'Chat';
  sla: {
    responseTime: number; // in hours
    resolutionTime: number; // in hours
    breached: boolean;
  };
  comments: {
    author: string;
    content: string;
    timestamp: string;
  }[];
}

interface TicketStats {
  openTickets: number;
  totalTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  slaBreachRate: number;
  ticketsByPriority: {
    priority: string;
    count: number;
  }[];
  ticketsByStatus: {
    status: string;
    count: number;
  }[];
  ticketTrend: {
    date: string;
    opened: number;
    closed: number;
  }[];
  topClients: {
    client: string;
    count: number;
  }[];
  topCategories: {
    category: string;
    count: number;
  }[];
}

// Priority and Status Colors
const priorityColorMap: Record<string, string> = {
  'Critical': 'bg-red-500',
  'High': 'bg-orange-500',
  'Medium': 'bg-yellow-500',
  'Low': 'bg-blue-500',
};

const statusColorMap: Record<string, string> = {
  'Open': 'bg-blue-500',
  'In Progress': 'bg-indigo-500',
  'Resolved': 'bg-green-500',
  'Closed': 'bg-gray-500',
  'Pending': 'bg-yellow-500',
};

const statusIconMap: Record<string, React.ReactNode> = {
  'Open': <AlertCircle className="h-4 w-4" />,
  'In Progress': <Clock className="h-4 w-4" />,
  'Resolved': <Check className="h-4 w-4" />,
  'Closed': <Check className="h-4 w-4" />,
  'Pending': <Clock className="h-4 w-4" />,
};

const Tickets: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({
    subject: '',
    description: '',
    status: 'Open',
    priority: 'Medium',
    type: 'Support',
    client: '',
    channel: 'Web',
    tags: []
  });
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const queryClient = useQueryClient();
  
  const {
    data: tickets,
    isLoading: ticketsLoading,
    error: ticketsError
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: fetchTickets
  });
  
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['ticketStats'],
    queryFn: fetchTicketStats
  });
  
  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: "Success",
        description: "Ticket created successfully",
        variant: "default"
      });
      setIsCreateDialogOpen(false);
      setNewTicket({
        subject: '',
        description: '',
        status: 'Open',
        priority: 'Medium',
        type: 'Support',
        client: '',
        channel: 'Web',
        tags: []
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create ticket: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const handleCreateTicket = () => {
    createTicketMutation.mutate({
      ...newTicket,
      id: `TKT-${Math.floor(Math.random() * 100000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: null,
      sla: {
        responseTime: 2,
        resolutionTime: 24,
        breached: false
      },
      comments: [],
    });
  };
  
  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewDialogOpen(true);
  };
  
  const filteredTickets = tickets?.filter(ticket => {
    if (filterStatus !== 'All' && ticket.status !== filterStatus) return false;
    if (filterPriority !== 'All' && ticket.priority !== filterPriority) return false;
    if (searchQuery && !ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !ticket.client.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getVariantForSLA = (isBreach: boolean) => {
    return isBreach ? "destructive" : "default";
  }
  
  if (ticketsError || statsError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <NeoCard className="p-6 text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
          <p className="text-neo-text-secondary mb-4">
            {ticketsError ? 'Failed to load tickets.' : 'Failed to load ticket statistics.'}
          </p>
          <Button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['tickets'] });
              queryClient.invalidateQueries({ queryKey: ['ticketStats'] });
            }}
            className="neo-button"
          >
            Retry
          </Button>
        </NeoCard>
      </div>
    );
  }

  if (ticketsLoading || statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="neo-flat h-24 w-24 rounded-full flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-neo-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-neo-primary">Loading ticket data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ticketing System</h1>
          <p className="text-neo-text-secondary">Manage support tickets and client issues</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="neo-button" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new support ticket</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Open Tickets</h3>
            <span className="neo-flat rounded-md p-1">
              <AlertCircle className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{stats?.openTickets}</p>
          <p className="text-xs text-neo-text-secondary mt-1">of {stats?.totalTickets} total tickets</p>
        </NeoCard>
        
        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Avg Response Time</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{stats?.avgResponseTime}h</p>
          <p className="text-xs text-neo-text-secondary mt-1">First response to client</p>
        </NeoCard>
        
        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Avg Resolution Time</h3>
            <span className="neo-flat rounded-md p-1">
              <Check className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{stats?.avgResolutionTime}h</p>
          <p className="text-xs text-neo-text-secondary mt-1">Time to resolve tickets</p>
        </NeoCard>
        
        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">SLA Breach Rate</h3>
            <span className="neo-flat rounded-md p-1">
              <AlertCircle className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{stats?.slaBreachRate}%</p>
          <p className="text-xs text-neo-text-secondary mt-1">Tickets exceeding SLA</p>
        </NeoCard>
      </div>
      
      <Tabs defaultValue="all" className="neo-flat p-1 rounded-lg">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="my">My Tickets</TabsTrigger>
          <TabsTrigger value="stats">Analytics</TabsTrigger>
          <TabsTrigger value="sla">SLA Tracker</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neo-text-secondary h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                className="pl-10 neo-flat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36 neo-flat">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-36 neo-flat">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="neo-flat">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Additional filters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="overflow-x-auto neo-flat rounded-lg p-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neo-border">
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Subject</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Client</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Priority</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Assignee</th>
                  <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets?.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-neo-border hover:bg-neo-bg/50 cursor-pointer" onClick={() => handleViewTicket(ticket)}>
                    <td className="py-3 px-4">{ticket.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{ticket.subject}</div>
                      <div className="text-xs text-neo-text-secondary">{ticket.type}</div>
                    </td>
                    <td className="py-3 px-4">{ticket.client}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${statusColorMap[ticket.status]}`}></div>
                        <span>{ticket.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${priorityColorMap[ticket.priority]} text-white`}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {ticket.assignee ? (
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <div className="neo-flat h-6 w-6 rounded-full flex items-center justify-center">
                              {ticket.assignee.slice(0, 2)}
                            </div>
                          </Avatar>
                          <span>{ticket.assignee}</span>
                        </div>
                      ) : (
                        <span className="text-neo-text-secondary">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neo-text-secondary">
                      {formatDistance(new Date(ticket.createdAt), new Date(), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!tickets || tickets.length === 0) ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-neo-text-secondary">
                    <Filter className="h-12 w-12 mb-2 opacity-50" />
                    <p>No tickets found</p>
                    <p className="text-sm mb-4">Get started by creating your first ticket</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Ticket
                    </Button>
                  </div>
                </td>
              </tr>
            ) : filteredTickets?.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-neo-text-secondary">
                    <Filter className="h-12 w-12 mb-2 opacity-50" />
                    <p>No tickets match your filters</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : null}
          </div>
        </TabsContent>
        
        <TabsContent value="my" className="p-4">
          <NeoCard className="p-6 text-center">
            <h3 className="font-medium mb-4">My Assigned Tickets</h3>
            <p className="text-neo-text-secondary mb-4">
              This section displays tickets assigned specifically to you for resolution.
            </p>
            <p>Please log in to view your assigned tickets.</p>
          </NeoCard>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeoCard className="p-6">
              <h3 className="font-medium mb-4">Tickets by Priority</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.ticketsByPriority}
                      dataKey="count"
                      nameKey="priority"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.priority}
                    >
                      {stats?.ticketsByPriority.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </NeoCard>
            
            <NeoCard className="p-6">
              <h3 className="font-medium mb-4">Tickets by Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.ticketsByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.status}
                    >
                      {stats?.ticketsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </NeoCard>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeoCard className="p-6">
              <h3 className="font-medium mb-4">Top Clients by Ticket Volume</h3>
              <div className="space-y-4">
                {stats?.topClients.map((client, index) => (
                  <div key={client.client} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{client.client}</p>
                      <p className="text-sm text-neo-text-secondary">{client.count} Tickets</p>
                    </div>
                    <Progress 
                      value={(client.count / stats.totalTickets) * 100} 
                      max={100} 
                      className="h-2 rounded-full"
                    />
                  </div>
                ))}
              </div>
            </NeoCard>
            
            <NeoCard className="p-6">
              <h3 className="font-medium mb-4">Top Categories by Ticket Volume</h3>
              <div className="space-y-4">
                {stats?.topCategories.map((category, index) => (
                  <div key={category.category} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{category.category}</p>
                      <p className="text-sm text-neo-text-secondary">{category.count} Tickets</p>
                    </div>
                    <Progress 
                      value={(category.count / stats.totalTickets) * 100} 
                      max={100} 
                      className="h-2 rounded-full"
                    />
                  </div>
                ))}
              </div>
            </NeoCard>
          </div>
        </TabsContent>
        
        <TabsContent value="sla" className="p-4">
          <NeoCard className="p-6 text-center">
            <h3 className="font-medium mb-4">Service Level Agreement (SLA) Tracker</h3>
            <p className="text-neo-text-secondary mb-4">
              Monitor and manage service level agreements to ensure timely ticket resolution.
            </p>
            <Button className="mt-4 neo-button">Configure SLA Settings</Button>
          </NeoCard>
        </TabsContent>
      </Tabs>
      
      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="subject" className="text-right text-sm">Subject</label>
            <Input 
              id="subject" 
              value={newTicket.subject || ''}
              onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
              className="col-span-3 neo-flat" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right text-sm">Description</label>
            <Textarea 
              id="description" 
              value={newTicket.description || ''}
              onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
              className="col-span-3 neo-flat" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="client" className="text-right text-sm">Client</label>
            <Input 
              id="client" 
              value={newTicket.client || ''}
              onChange={(e) => setNewTicket({...newTicket, client: e.target.value})}
              className="col-span-3 neo-flat" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="priority" className="text-right text-sm">Priority</label>
            <Select 
              value={newTicket.priority} 
              onValueChange={(value) => setNewTicket({...newTicket, priority: value as  'Critical' | 'High' | 'Medium' | 'Low'})}
            >
              <SelectTrigger className="col-span-3 neo-flat">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="type" className="text-right text-sm">Type</label>
            <Select 
              value={newTicket.type} 
              onValueChange={(value) => setNewTicket({...newTicket, type: value as 'Bug' | 'Feature' | 'Support' | 'Question' | 'Other'})}
            >
              <SelectTrigger className="col-span-3 neo-flat">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bug">Bug</SelectItem>
                <SelectItem value="Feature">Feature Request</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Question">Question</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="channel" className="text-right text-sm">Channel</label>
            <Select 
              value={newTicket.channel} 
              onValueChange={(value) => setNewTicket({...newTicket, channel: value as 'Email' | 'Phone' | 'Web' | 'Chat'})}
            >
              <SelectTrigger className="col-span-3 neo-flat">
                <SelectValue placeholder="Select Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="Chat">Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateTicket}>
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Ticket Dialog */}
      {selectedTicket && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedTicket.subject}
                <Badge className={`${statusColorMap[selectedTicket.status]} text-white ml-2`}>
                  {selectedTicket.status}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-neo-text-secondary">Ticket ID</h3>
                  <p>{selectedTicket.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neo-text-secondary">Client</h3>
                  <p>{selectedTicket.client}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neo-text-secondary">Priority</h3>
                  <p>{selectedTicket.priority}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neo-text-secondary">Type</h3>
                  <p>{selectedTicket.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neo-text-secondary">Channel</h3>
                  <p>{selectedTicket.channel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neo-text-secondary">Created At</h3>
                  <p>{formatDistance(new Date(selectedTicket.createdAt), new Date(), { addSuffix: true })}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neo-text-secondary">Due Date</h3>
                  <p>{selectedTicket.dueDate ? formatDistance(new Date(selectedTicket.dueDate), new Date(), { addSuffix: true }) : 'No due date'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neo-text-secondary">SLA</h3>
                  <p>
                    Response Time: {selectedTicket.sla.responseTime}h, Resolution Time: {selectedTicket.sla.resolutionTime}h
                    {selectedTicket.sla.breached ? (
                      <Badge variant="destructive">Breached</Badge>
                    ) : (
                      <Badge>Within SLA</Badge>
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-neo-text-secondary">Description</h3>
                <p>{selectedTicket.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-neo-text-secondary">Comments</h3>
                {selectedTicket.comments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTicket.comments.map((comment, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Avatar className="h-6 w-6 mr-2">
                          <div className="neo-flat h-6 w-6 rounded-full flex items-center justify-center">
                            {comment.author.slice(0, 2)}
                          </div>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{comment.author}</p>
                          <p className="text-xs text-neo-text-secondary">{formatDistance(new Date(comment.timestamp), new Date(), { addSuffix: true })}</p>
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neo-text-secondary">No comments yet</p>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-neo-text-secondary">Add Comment</h3>
              <Textarea placeholder="Write your comment here..." className="neo-flat" />
            </div>
            
            <DialogFooter className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              
              <Select defaultValue={selectedTicket.status}>
                <SelectTrigger className="w-36 neo-flat">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button type="button">
                Add Comment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Tickets;
