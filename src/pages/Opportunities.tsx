
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowRight, BarChart as BarChartIcon, ChevronDown, Edit, Filter, Plus, RefreshCcw, Trash, Clock } from 'lucide-react';
import NeoCard from '@/components/ui/neo-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Define chart colors
const CHART_COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

// API Service for Opportunity Management
const fetchOpportunities = async (): Promise<Opportunity[]> => {
  const response = await fetch('https://api.mockaroo.com/api/fa20a530?count=25&key=e7c3d5c0');
  if (!response.ok) throw new Error('Failed to fetch opportunities');
  return response.json();
};

const fetchOpportunityStats = async (): Promise<OpportunityStats> => {
  const response = await fetch('https://api.mockaroo.com/api/cb88a5a0?key=e7c3d5c0');
  if (!response.ok) throw new Error('Failed to fetch opportunity stats');
  return response.json();
};

const createOpportunity = async (opportunity: Partial<Opportunity>): Promise<Opportunity> => {
  const response = await fetch('https://api.mockaroo.com/api/fa20a530?key=e7c3d5c0', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(opportunity),
  });
  if (!response.ok) throw new Error('Failed to create opportunity');
  return response.json();
};

// Types
interface Opportunity {
  id: string;
  name: string;
  client: string;
  value: number;
  stage: string;
  closeDate: string;
  probability: number;
  owner: string;
  products: string[];
  createdAt: string;
  lastActivity?: string;
  nextAction?: string;
  nextActionDate?: string;
}

interface OpportunityStats {
  totalValue: number;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  pipelineByStage: { stage: string; count: number; value: number }[];
  winRate: number;
  avgDealSize: number;
  salesCycle: number; // in days
  topProducts: { product: string; count: number; value: number }[];
  monthlySales: { month: string; closed: number; target: number }[];
}

// Define props interface for Opportunities
interface OpportunitiesProps {
  initialTab?: string;
}

const stageOrder = ['Qualification', 'Solution Design', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const stageColorMap: Record<string, string> = {
  'Qualification': 'bg-blue-500',
  'Solution Design': 'bg-indigo-500',
  'Proposal': 'bg-purple-500',
  'Negotiation': 'bg-violet-500',
  'Closed Won': 'bg-green-500',
  'Closed Lost': 'bg-red-500'
};

const Opportunities: React.FC<OpportunitiesProps> = ({ initialTab }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [newOpportunity, setNewOpportunity] = useState<Partial<Opportunity>>({
    name: '',
    client: '',
    value: 0,
    stage: 'Qualification',
    probability: 10,
    owner: '',
    products: []
  });
  const [filterStage, setFilterStage] = useState<string>('All Stages');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  
  const queryClient = useQueryClient();
  
  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: fetchOpportunities
  });
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['opportunityStats'],
    queryFn: fetchOpportunityStats
  });

  const createOpportunityMutation = useMutation({
    mutationFn: createOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: "Success",
        description: "Opportunity created successfully",
        variant: "default"
      });
      setIsCreateDialogOpen(false);
      setNewOpportunity({
        name: '',
        client: '',
        value: 0,
        stage: 'Qualification',
        probability: 10,
        owner: '',
        products: []
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create opportunity: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleCreateOpportunity = () => {
    createOpportunityMutation.mutate({
      ...newOpportunity,
      id: `OPP-${Math.floor(Math.random() * 100000)}`,
      createdAt: new Date().toISOString(),
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  };

  const handleViewOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsViewDialogOpen(true);
  };

  const filteredOpportunities = opportunities?.filter(opp => 
    filterStage === 'All Stages' || opp.stage === filterStage
  ).sort((a, b) => {
    if (sortBy === 'value') {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    } else if (sortBy === 'probability') {
      return sortOrder === 'asc' ? a.probability - b.probability : b.probability - a.probability;
    } else if (sortBy === 'stage') {
      const stageIndexA = stageOrder.indexOf(a.stage);
      const stageIndexB = stageOrder.indexOf(b.stage);
      return sortOrder === 'asc' ? stageIndexA - stageIndexB : stageIndexB - stageIndexA;
    } else {
      // Default: sort by createdAt
      return sortOrder === 'asc'
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt);
    }
  });

  function getVariantForSuccess() {
    // Return a valid Badge variant
    return "default";
  }

  if (opportunitiesLoading || statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="neo-flat h-24 w-24 rounded-full flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-neo-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-neo-primary">Loading opportunity data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Opportunity Management</h1>
          <p className="text-neo-text-secondary">Track and manage your sales pipeline</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="neo-button" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Opportunity
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new sales opportunity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="neo-flat" onClick={() => queryClient.invalidateQueries({ queryKey: ['opportunities'] })}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh opportunity data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Pipeline Value</h3>
            <span className="neo-flat rounded-md p-1">
              <BarChartIcon className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(stats?.totalValue || 0)}</p>
          <p className="text-xs text-neo-text-secondary mt-1">{stats?.openDeals || 0} active opportunities</p>
        </NeoCard>
        
        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Win Rate</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{stats?.winRate || 0}%</p>
          <p className="text-xs text-neo-text-secondary mt-1">{stats?.wonDeals || 0} deals won</p>
        </NeoCard>
        
        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Avg Deal Size</h3>
            <span className="neo-flat rounded-md p-1">
              <BarChartIcon className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(stats?.avgDealSize || 0)}</p>
          <p className="text-xs text-neo-text-secondary mt-1">Last 30 days</p>
        </NeoCard>
        
        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Avg Sales Cycle</h3>
            <span className="neo-flat rounded-md p-1">
              <Clock className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{stats?.salesCycle || 0} days</p>
          <p className="text-xs text-neo-text-secondary mt-1">From qualification to close</p>
        </NeoCard>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pipeline" className="neo-flat p-1 rounded-lg">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pipeline" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-40 neo-flat">
                  <SelectValue placeholder="Filter by Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Stages">All Stages</SelectItem>
                  {stageOrder.map(stage => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={viewMode === 'table' ? 'neo-pressed' : 'neo-flat'}
                        onClick={() => setViewMode('table')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18" />
                          <path d="M3 15h18" />
                          <path d="M9 3v18" />
                          <path d="M15 3v18" />
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Table View</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={viewMode === 'kanban' ? 'neo-pressed' : 'neo-flat'}
                        onClick={() => setViewMode('kanban')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="5" height="18" rx="1" />
                          <rect x="9.5" y="3" width="5" height="18" rx="1" />
                          <rect x="16" y="3" width="5" height="18" rx="1" />
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Kanban View</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-auto">
              <label className="text-sm text-neo-text-secondary">Sort by:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 neo-flat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="value">Value</SelectItem>
                  <SelectItem value="probability">Probability</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="neo-flat"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
          
          {viewMode === 'table' ? (
            <div className="overflow-x-auto neo-flat rounded-lg p-1">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neo-border">
                    <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Client</th>
                    <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Value</th>
                    <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Stage</th>
                    <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Probability</th>
                    <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Close Date</th>
                    <th className="text-right py-3 px-4 text-neo-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpportunities?.map((opp) => (
                    <tr key={opp.id} className="border-b border-neo-border hover:bg-neo-bg/50 cursor-pointer" onClick={() => handleViewOpportunity(opp)}>
                      <td className="py-3 px-4">{opp.name}</td>
                      <td className="py-3 px-4">{opp.client}</td>
                      <td className="py-3 px-4">{formatCurrency(opp.value)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${stageColorMap[opp.stage]}`}></div>
                          <span>{opp.stage}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-neo-bg rounded-full h-2 mr-2">
                            <div 
                              className="h-2 rounded-full bg-neo-primary" 
                              style={{ width: `${opp.probability}%` }}
                            />
                          </div>
                          <span>{opp.probability}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{new Date(opp.closeDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="neo-flat"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOpportunity(opp);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Opportunity</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {stageOrder.slice(0, -2).map(stage => (
                <NeoCard key={stage} variant="flat" className="p-2">
                  <div className="flex items-center justify-between p-2 mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${stageColorMap[stage]}`}></div>
                      <h3 className="font-medium">{stage}</h3>
                    </div>
                    <Badge variant="outline">{filteredOpportunities?.filter(opp => opp.stage === stage).length || 0}</Badge>
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto p-1">
                    {filteredOpportunities?.filter(opp => opp.stage === stage).map(opp => (
                      <NeoCard key={opp.id} variant="pressed" className="p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewOpportunity(opp)}>
                        <h4 className="font-medium text-sm mb-2">{opp.name}</h4>
                        <div className="flex justify-between text-xs text-neo-text-secondary mb-2">
                          <span>{opp.client}</span>
                          <span>{formatCurrency(opp.value)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs">
                            <span className="text-neo-text-secondary">Close: </span>
                            <span>{new Date(opp.closeDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                          <Badge variant="outline">{opp.probability}%</Badge>
                        </div>
                      </NeoCard>
                    ))}
                    
                    {filteredOpportunities?.filter(opp => opp.stage === stage).length === 0 && (
                      <div className="p-4 text-center text-neo-text-secondary text-sm">
                        No opportunities in this stage
                      </div>
                    )}
                  </div>
                </NeoCard>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeoCard className="p-6">
              <h3 className="font-medium mb-4">Pipeline by Stage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.pipelineByStage}
                      dataKey="value"
                      nameKey="stage"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.stage}
                    >
                      {stats?.pipelineByStage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Stage: ${label}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </NeoCard>
            
            <NeoCard className="p-6">
              <h3 className="font-medium mb-4">Pipeline Value by Stage</h3>
              <div className="space-y-4">
                {stats?.pipelineByStage.map((stage, index) => (
                  <div key={stage.stage} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center">
                        <span 
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        ></span>
                        {stage.stage}
                      </span>
                      <span className="font-medium">{formatCurrency(stage.value)}</span>
                    </div>
                    <Progress 
                      value={(stage.value / stats.totalValue) * 100}
                      className={`h-2 ${index % 2 === 0 ? 'bg-neo-primary' : 'bg-neo-secondary'}`}
                    />
                    <div className="flex justify-between text-xs text-neo-text-secondary">
                      <span>{stage.count} deals</span>
                      <span>{Math.round((stage.value / stats.totalValue) * 100)}% of pipeline</span>
                    </div>
                  </div>
                ))}
              </div>
            </NeoCard>
          </div>
          
          <NeoCard className="p-6">
            <h3 className="font-medium mb-4">Monthly Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="closed" name="Closed Deals" fill="#9b87f5" />
                  <Bar dataKey="target" name="Target" fill="#D6BCFA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </NeoCard>
        </TabsContent>
        
        <TabsContent value="forecast" className="p-4">
          <NeoCard className="p-6 text-center">
            <h3 className="font-medium mb-4">Revenue Forecast</h3>
            <p className="text-neo-text-secondary mb-4">
              Revenue forecast visualization with quarterly projections and opportunity-weighted calculations.
            </p>
            <p>Switch to the Forecasting module for detailed analysis</p>
            <Button className="mt-4 neo-button">
              Go to Forecasting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </NeoCard>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <NeoCard className="p-6">
            <h3 className="font-medium mb-4">Top Products in Pipeline</h3>
            <div className="space-y-4">
              {stats?.topProducts.map((product, index) => (
                <div key={product.product} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{product.product}</span>
                    <span className="font-medium">{formatCurrency(product.value)}</span>
                  </div>
                  <Progress 
                    value={product.count} 
                    max={Math.max(...stats.topProducts.map(p => p.count))}
                    className={`h-2 ${index % 2 === 0 ? 'bg-neo-primary' : 'bg-neo-secondary'}`}
                  />
                  <div className="flex justify-between text-xs text-neo-text-secondary">
                    <span>{product.count} opportunities</span>
                    <span>{Math.round((product.value / stats.totalValue) * 100)}% of pipeline</span>
                  </div>
                </div>
              ))}
            </div>
          </NeoCard>
        </TabsContent>
      </Tabs>
      
      {/* Create Opportunity Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Opportunity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm">Name</label>
              <Input 
                id="name" 
                className="col-span-3 neo-flat" 
                value={newOpportunity.name} 
                onChange={(e) => setNewOpportunity({...newOpportunity, name: e.target.value})} 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="client" className="text-right text-sm">Client</label>
              <Input 
                id="client" 
                className="col-span-3 neo-flat" 
                value={newOpportunity.client} 
                onChange={(e) => setNewOpportunity({...newOpportunity, client: e.target.value})} 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="value" className="text-right text-sm">Value ($)</label>
              <Input 
                id="value" 
                type="number" 
                className="col-span-3 neo-flat" 
                value={newOpportunity.value} 
                onChange={(e) => setNewOpportunity({...newOpportunity, value: parseFloat(e.target.value)})} 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="stage" className="text-right text-sm">Stage</label>
              <Select 
                value={newOpportunity.stage} 
                onValueChange={(value) => setNewOpportunity({...newOpportunity, stage: value})}
              >
                <SelectTrigger className="col-span-3 neo-flat">
                  <SelectValue placeholder="Select Stage" />
                </SelectTrigger>
                <SelectContent>
                  {stageOrder.slice(0, -1).map(stage => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="probability" className="text-right text-sm">Probability (%)</label>
              <Input 
                id="probability" 
                type="number" 
                min="0"
                max="100"
                className="col-span-3 neo-flat" 
                value={newOpportunity.probability} 
                onChange={(e) => setNewOpportunity({...newOpportunity, probability: Math.min(100, Math.max(0, parseInt(e.target.value)))})} 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="owner" className="text-right text-sm">Owner</label>
              <Input 
                id="owner" 
                className="col-span-3 neo-flat" 
                value={newOpportunity.owner} 
                onChange={(e) => setNewOpportunity({...newOpportunity, owner: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              className="neo-flat"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOpportunity} 
              disabled={!newOpportunity.name || !newOpportunity.client || !newOpportunity.value}
              className="neo-button"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View/Edit Opportunity Dialog */}
      {selectedOpportunity && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Opportunity Details</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedOpportunity.name}</h2>
                  <p className="text-neo-text-secondary">{selectedOpportunity.client}</p>
                </div>
                <Badge 
                  className={`${stageColorMap[selectedOpportunity.stage]} text-white`}
                >
                  {selectedOpportunity.stage}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-neo-text-secondary">Value</p>
                  <p className="font-medium">{formatCurrency(selectedOpportunity.value)}</p>
                </div>
                <div>
                  <p className="text-sm text-neo-text-secondary">Probability</p>
                  <p className="font-medium">{selectedOpportunity.probability}%</p>
                </div>
                <div>
                  <p className="text-sm text-neo-text-secondary">Created</p>
                  <p className="font-medium">{new Date(selectedOpportunity.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-neo-text-secondary">Expected Close</p>
                  <p className="font-medium">{new Date(selectedOpportunity.closeDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-neo-text-secondary">Owner</p>
                  <p className="font-medium">{selectedOpportunity.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-neo-text-secondary">Weighted Value</p>
                  <p className="font-medium">{formatCurrency(selectedOpportunity.value * selectedOpportunity.probability / 100)}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Opportunities;
