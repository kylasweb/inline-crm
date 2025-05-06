import { fetchData, postData, updateData, deleteData, ApiResponse, Lead } from '../api';
import { 
  Opportunity, 
  OpportunityFilters, 
  CreateOpportunityDTO, 
  UpdateOpportunityDTO, 
  CloseOpportunityDTO,
  OpportunityStage,
  OpportunityAnalytics,
  OpportunityForecast
} from './opportunityTypes';
import { leadService } from '../leadService';

export const opportunityService = {
  // Core CRUD operations
  async getAll(filters?: OpportunityFilters): Promise<ApiResponse<Opportunity[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'dateRange') {
            queryParams.append('startDate', value.start);
            queryParams.append('endDate', value.end);
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    
    return fetchData<Opportunity[]>(`/opportunities?${queryParams.toString()}`);
  },

  async getById(id: string): Promise<ApiResponse<Opportunity>> {
    return fetchData<Opportunity>(`/opportunities/${id}`);
  },

  async create(data: CreateOpportunityDTO): Promise<ApiResponse<Opportunity>> {
    // If created from a lead, validate lead exists
    if (data.source.type === 'lead' && data.source.id) {
      const leadResponse = await leadService.getLeadById(data.source.id);
      if (!leadResponse.success) {
        return { success: false, error: 'Invalid lead reference' };
      }
    }

    return postData<Opportunity>('/opportunities', data);
  },

  async update(id: string, data: UpdateOpportunityDTO): Promise<ApiResponse<Opportunity>> {
    return updateData<Opportunity>(`/opportunities/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return deleteData(`/opportunities/${id}`);
  },

  // Specialized operations
  async convertLeadToOpportunity(leadId: string): Promise<ApiResponse<Opportunity>> {
    const leadResponse = await leadService.getLeadById(leadId);
    
    if (!leadResponse.success || !leadResponse.data) {
      return { success: false, error: 'Lead not found' };
    }

    const lead = leadResponse.data;

    // Create opportunity from lead data
    const opportunityData: CreateOpportunityDTO = {
      name: `${lead.company} - ${lead.name}`,
      description: lead.notes || '',
      source: {
        type: 'lead',
        id: leadId
      },
      accountId: '', // This will need to be linked to an account separately
      value: {
        amount: 0, // This would need to be set during conversion
        currency: 'USD' // Default currency, should be configurable
      },
      expectedCloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // Default to 3 months
      assignedTo: lead.assignedTo || '',
      priority: 'medium'
    };

    const response = await this.create(opportunityData);

    if (response.success) {
      // Update lead status to indicate conversion
      await leadService.updateLead(leadId, {
        status: 'converted'
      });
    }

    return response;
  },

  async updateStage(id: string, stage: OpportunityStage): Promise<ApiResponse<Opportunity>> {
    return this.update(id, { stage });
  },

  async markAsWon(id: string, closeData: CloseOpportunityDTO): Promise<ApiResponse<Opportunity>> {
    return this.update(id, {
      status: 'won',
      actualCloseDate: closeData.actualCloseDate,
      value: closeData.finalValue,
      stage: OpportunityStage.CLOSING
    });
  },

  async markAsLost(id: string, reason: string): Promise<ApiResponse<Opportunity>> {
    return this.update(id, {
      status: 'lost',
      actualCloseDate: new Date().toISOString(),
      metadata: {
        lossReason: reason
      }
    });
  },

  async reassign(id: string, assigneeId: string): Promise<ApiResponse<Opportunity>> {
    return this.update(id, { assignedTo: assigneeId });
  },

  // Analytics operations
  async getAnalytics(filters?: OpportunityFilters): Promise<ApiResponse<OpportunityAnalytics>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'dateRange') {
            queryParams.append('startDate', value.start);
            queryParams.append('endDate', value.end);
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    return fetchData<OpportunityAnalytics>(`/opportunities/analytics?${queryParams.toString()}`);
  },

  async getForecast(period: string): Promise<ApiResponse<OpportunityForecast>> {
    return fetchData<OpportunityForecast>(`/opportunities/forecast?period=${period}`);
  }
};

// Helper functions for opportunity management
export const fetchOpportunities = async (
  filters: OpportunityFilters
): Promise<Opportunity[]> => {
  const response = await opportunityService.getAll(filters);
  if (response.success && response.data) {
    return response.data;
  }
  return [];
};

export const fetchOpportunityAnalytics = async (
  filters?: OpportunityFilters
): Promise<OpportunityAnalytics | null> => {
  const response = await opportunityService.getAnalytics(filters);
  if (response.success && response.data) {
    return response.data;
  }
  return null;
};

export const fetchOpportunityForecast = async (
  period: string
): Promise<OpportunityForecast | null> => {
  const response = await opportunityService.getForecast(period);
  if (response.success && response.data) {
    return response.data;
  }
  return null;
};