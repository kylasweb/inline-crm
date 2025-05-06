import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService, LeadFormData } from '@/services/leadService';
export type { LeadFormData };
import { useEntitiesStore, type EntityCache } from './entities.store';
import { QualificationResult } from '@/services/qualification/qualificationTypes';
import type { Lead as LeadType, ApiResponse } from '@/services/api';

// Types
export interface Lead extends LeadFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  assignedTo?: string;
  score?: number;
}

interface LeadFilters {
  search?: string;
  source?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface LeadSort {
  field: keyof Lead;
  direction: 'asc' | 'desc';
}

interface LeadState {
  // Filters and Sorting
  filters: LeadFilters;
  sort: LeadSort;
  
  // UI State
  selectedLeadId: string | null;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  
  // Actions
  setFilters: (filters: LeadFilters) => void;
  setSort: (sort: LeadSort) => void;
  setSelectedLeadId: (id: string | null) => void;
  setCreateDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  
  // Workflow Actions
  qualifyLead: (id: string) => Promise<void>;
  disqualifyLead: (id: string) => Promise<void>;
  convertToOpportunity: (id: string) => Promise<void>;
}

const initialState: Omit<LeadState, 'setFilters' | 'setSort' | 'setSelectedLeadId' | 'setCreateDialogOpen' | 'setEditDialogOpen' | 'qualifyLead' | 'disqualifyLead' | 'convertToOpportunity'> = {
  filters: {},
  sort: { field: 'createdAt', direction: 'desc' },
  selectedLeadId: null,
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
};

export const useLeadsStore = create<LeadState>()((set) => ({
  ...initialState,

  setFilters: (filters) => set({ filters }),
  setSort: (sort) => set({ sort }),
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  setCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
  setEditDialogOpen: (open) => set({ isEditDialogOpen: open }),

  // Workflow Actions
  qualifyLead: async (id) => {
    const result = await leadService.requalifyLead(id);
    if (result.success && result.data) {
      await leadService.updateLead(id, { status: 'Qualified' });
      useEntitiesStore.getState().invalidateCache('leads');
    }
  },

  disqualifyLead: async (id) => {
    await leadService.updateLead(id, { status: 'Lost' });
    useEntitiesStore.getState().invalidateCache('leads');
  },

  convertToOpportunity: async (id) => {
    // For now we just mark it as converted - actual conversion would be implemented in opportunity service
    await leadService.updateLead(id, { status: 'Converted' });
    useEntitiesStore.getState().invalidateCache('leads');
  },
}));

// React Query Hooks
export const useLeads = (filters: LeadFilters = {}, sort: LeadSort = { field: 'createdAt', direction: 'desc' }) => {
  const entitiesStore = useEntitiesStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['leads', filters, sort],
    queryFn: async () => {
      const cache = entitiesStore.leads as EntityCache<Lead>;
      
      // Check if cache is valid
      if (cache && cache.timestamp > 0 && Date.now() - cache.timestamp < 5 * 60 * 1000) {
        let items = Object.values(cache.items);
        
        // Apply filters
        if (filters.search) {
          items = items.filter(lead => 
            lead.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
            lead.company.toLowerCase().includes(filters.search!.toLowerCase())
          );
        }
        if (filters.source) {
          items = items.filter(lead => lead.source === filters.source);
        }
        if (filters.status) {
          items = items.filter(lead => lead.status === filters.status);
        }
        if (filters.dateRange) {
          items = items.filter(lead => {
            const createdAt = new Date(lead.createdAt);
            return createdAt >= filters.dateRange!.start && createdAt <= filters.dateRange!.end;
          });
        }

        // Apply sorting
        items.sort((a, b) => {
          const aValue = a[sort.field];
          const bValue = b[sort.field];
          return sort.direction === 'asc' 
            ? aValue > bValue ? 1 : -1
            : aValue < bValue ? 1 : -1;
        });

        return items;
      }

      // Fetch fresh data
      const response = await leadService.getLeads();
      let items = response.data || [];

      // Apply filters
      if (filters) {
        items = items.filter(lead => {
          let matches = true;
          
          if (filters.search) {
            const search = filters.search.toLowerCase();
            matches = matches && (
              lead.name.toLowerCase().includes(search) ||
              lead.company.toLowerCase().includes(search)
            );
          }
          
          if (filters.source) {
            matches = matches && lead.source === filters.source;
          }
          
          if (filters.status) {
            matches = matches && lead.status === filters.status;
          }
          
          if (filters.dateRange) {
            const createdAt = new Date(lead.createdAt);
            matches = matches &&
              createdAt >= filters.dateRange.start &&
              createdAt <= filters.dateRange.end;
          }
          
          return matches;
        });
      }

      // Apply sorting
      if (sort) {
        items.sort((a, b) => {
          const aValue = a[sort.field];
          const bValue = b[sort.field];
          return sort.direction === 'asc'
            ? aValue > bValue ? 1 : -1
            : aValue < bValue ? 1 : -1;
        });
      }
      entitiesStore.updateCache('leads', items);
      return items;
    }
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const entitiesStore = useEntitiesStore();

  return useMutation({
    mutationFn: (data: LeadFormData) => leadService.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      entitiesStore.invalidateCache('leads');
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  const entitiesStore = useEntitiesStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) => 
      leadService.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      entitiesStore.invalidateCache('leads');
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  const entitiesStore = useEntitiesStore();

  return useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      entitiesStore.invalidateCache('leads');
    },
  });
};