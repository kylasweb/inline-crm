import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis 
} from 'recharts';
import { fetchOpportunities } from '@/services/opportunity/opportunityService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NeoCard from '@/components/ui/neo-card';
import NeoBadge from '@/components/ui/neo-badge';
import { ArrowUpRight, FileText, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import OpportunityFormDialog from '@/components/opportunities/OpportunityFormDialog';
import { 
  Opportunity, 
  CreateOpportunityDTO, 
  OpportunityStage, 
  OpportunityStatus 
} from '@/services/opportunity/opportunityTypes';

// Define chart colors
const CHART_COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

// Define status badge variants
const statusVariants: Record<string, 'success' | 'danger' | 'warning' | 'primary'> = {
  [OpportunityStatus.WON]: 'success',
  [OpportunityStatus.LOST]: 'danger',
  [OpportunityStatus.SUSPENDED]: 'warning',
  [OpportunityStatus.OPEN]: 'primary'
};

// Define props interface for OpportunityManagement
interface OpportunityManagementProps {
  filter?: string;
  activeTab?: string;
}

function mapOpportunityToDTO(opportunity: Opportunity): Partial<CreateOpportunityDTO> {
  return {
    name: opportunity.name,
    description: opportunity.description,
    source: opportunity.source,
    accountId: opportunity.accountId,
    value: opportunity.value,
    expectedCloseDate: opportunity.expectedCloseDate,
    products: opportunity.products,
    assignedTo: opportunity.assignedTo,
    priority: opportunity.priority,
    metadata: opportunity.metadata
  };
}

const OpportunityManagement: React.FC<OpportunityManagementProps> = ({ filter, activeTab = "list" }) => {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [stage, setStage] = useState<OpportunityStage | 'All Stages'>('All Stages');
  const [status, setStatus] = useState<OpportunityStatus | 'All Statuses'>('All Statuses');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const { data: opportunities, isLoading, error } = useQuery({
    queryKey: ['opportunities', dateRange, searchQuery, stage, status, filter, activeTab],
    queryFn: () => fetchOpportunities({
      dateRange: {
        start: dateRange.from?.toISOString() || '',
        end: dateRange.to?.toISOString() || ''
      },
      stage: stage !== 'All Stages' ? stage : undefined,
      status: status !== 'All Statuses' ? status : undefined
    })
  });

  const handleCreateOpportunity = () => {
    setSelectedOpportunity(null);
    setIsFormOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsFormOpen(true);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <NeoCard className="p-6 text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
          <p className="text-neo-text-secondary mb-4">
            Failed to load opportunities data. Please try again.
          </p>
          <Button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['opportunities'] });
            }}
            className="neo-button"
          >
            Retry
          </Button>
        </NeoCard>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="neo-flat h-24 w-24 rounded-full flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-neo-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-neo-primary">Loading opportunities...</p>
      </div>
    );
  }

  // Calculate summary stats
  const totalValue = opportunities?.reduce((sum, opp) => sum + opp.value.amount, 0) || 0;
  const avgDealSize = opportunities?.length ? totalValue / opportunities.length : 0;
  const openOpportunities = opportunities?.filter(opp => opp.status === OpportunityStatus.OPEN).length || 0;
  const winRate = opportunities?.length
    ? (opportunities.filter(opp => opp.status === OpportunityStatus.WON).length / opportunities.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Opportunity Management</h1>
          <p className="text-neo-text-secondary">Track and manage sales opportunities</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="neo-button" onClick={handleCreateOpportunity}>
            <Plus className="h-4 w-4 mr-2" />
            Add Opportunity
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
            <h3 className="text-sm text-neo-text-secondary">Total Pipeline</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          <p className="text-xs text-neo-text-secondary mt-1">Total value of all opportunities</p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Average Deal Size</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">${avgDealSize.toLocaleString()}</p>
          <p className="text-xs text-neo-text-secondary mt-1">Average value per opportunity</p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Open Opportunities</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{openOpportunities}</p>
          <p className="text-xs text-neo-text-secondary mt-1">Active opportunities in pipeline</p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-neo-text-secondary">Win Rate</h3>
            <span className="neo-flat rounded-md p-1">
              <ArrowUpRight className="h-4 w-4 text-neo-primary" />
            </span>
          </div>
          <p className="text-2xl font-bold">{winRate.toFixed(1)}%</p>
          <p className="text-xs text-neo-text-secondary mt-1">Overall win rate</p>
        </NeoCard>
      </div>

      {/* Filters and Table */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neo-text-secondary h-4 w-4" />
          <Input
            placeholder="Search opportunities..."
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

          <Select value={stage} onValueChange={(value) => setStage(value as OpportunityStage | 'All Stages')}>
            <SelectTrigger className="w-36 neo-flat">
              <SelectValue placeholder="Filter by Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Stages">All Stages</SelectItem>
              <SelectItem value={OpportunityStage.QUALIFICATION}>Qualification</SelectItem>
              <SelectItem value={OpportunityStage.NEEDS_ANALYSIS}>Needs Analysis</SelectItem>
              <SelectItem value={OpportunityStage.PROPOSAL}>Proposal</SelectItem>
              <SelectItem value={OpportunityStage.NEGOTIATION}>Negotiation</SelectItem>
              <SelectItem value={OpportunityStage.CLOSING}>Closing</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={status} 
            onValueChange={(value) => setStatus(value as OpportunityStatus | 'All Statuses')}
          >
            <SelectTrigger className="w-36 neo-flat">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Statuses">All Statuses</SelectItem>
              <SelectItem value={OpportunityStatus.OPEN}>Open</SelectItem>
              <SelectItem value={OpportunityStatus.WON}>Won</SelectItem>
              <SelectItem value={OpportunityStatus.LOST}>Lost</SelectItem>
              <SelectItem value={OpportunityStatus.SUSPENDED}>Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="neo-flat">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Opportunity List */}
      <div className="overflow-x-auto neo-flat rounded-lg p-1">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neo-border">
              <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Name</th>
              <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Stage</th>
              <th className="text-right py-3 px-4 text-neo-text-secondary font-medium">Value</th>
              <th className="text-center py-3 px-4 text-neo-text-secondary font-medium">Probability</th>
              <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Owner</th>
              <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Expected Close</th>
              <th className="text-left py-3 px-4 text-neo-text-secondary font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {!opportunities?.length ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-neo-text-secondary">
                    <FileText className="h-12 w-12 mb-2 opacity-50" />
                    <p>No opportunities found</p>
                    <p className="text-sm mb-4">Try adjusting your filters or add a new opportunity</p>
                    <Button onClick={handleCreateOpportunity}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Opportunity
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              opportunities.map((opportunity) => (
              <tr 
                key={opportunity.id} 
                className="border-b border-neo-border hover:bg-neo-bg/50 cursor-pointer"
                onClick={() => handleEditOpportunity(opportunity)}
              >
                <td className="py-3 px-4">{opportunity.name}</td>
                <td className="py-3 px-4">{opportunity.stage}</td>
                <td className="py-3 px-4 text-right">
                  ${opportunity.value.amount.toLocaleString()}
                  {opportunity.value.recurringValue && (
                    <span className="text-xs text-neo-text-secondary ml-1">
                      +${opportunity.value.recurringValue.toLocaleString()}/{opportunity.value.recurringPeriod}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">{opportunity.probability}%</td>
                <td className="py-3 px-4">{opportunity.assignedTo}</td>
                <td className="py-3 px-4">{format(new Date(opportunity.expectedCloseDate), 'MMM dd, yyyy')}</td>
                <td className="py-3 px-4">
                  <NeoBadge variant={statusVariants[opportunity.status] || 'primary'}>
                    {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                  </NeoBadge>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Form Dialog */}
      <OpportunityFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={selectedOpportunity ? 'edit' : 'create'}
        initialData={selectedOpportunity ? mapOpportunityToDTO(selectedOpportunity) : undefined}
        opportunityId={selectedOpportunity?.id}
      />
    </div>
  );
};

export default OpportunityManagement;