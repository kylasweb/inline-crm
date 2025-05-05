import { fetchData, postData, updateData, deleteData, ApiResponse, Lead } from './api';

export interface LeadStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  leadsBySource: { source: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  leadTrend: { date: string; leads: number }[];
}

export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  notes?: string;
}

export const leadService = {
  async getLeads(): Promise<ApiResponse<Lead[]>> {
    return fetchData<Lead[]>('/leads');
  },
  
  async getLeadById(id: string): Promise<ApiResponse<Lead>> {
    return fetchData<Lead>(`/leads/${id}`);
  },
  
  async getLeadStats(): Promise<ApiResponse<LeadStats>> {
    return fetchData<LeadStats>('/leads/stats');
  },
  
  async createLead(leadData: LeadFormData): Promise<ApiResponse<Lead>> {
    return postData<Lead>('/leads', leadData);
  },
  
  async updateLead(id: string, leadData: Partial<LeadFormData>): Promise<ApiResponse<Lead>> {
    return updateData<Lead>(`/leads/${id}`, leadData);
  },
  
  async deleteLead(id: string): Promise<ApiResponse<void>> {
    return deleteData(`/leads/${id}`);
  }
};

interface DateRange {
  from: Date;
  to?: Date;
}

// Helper functions for the LeadManagement component
export const fetchLeads = (dateRange: DateRange, searchQuery: string, leadSource: string, leadStatus: string): Promise<Lead[]> => {
  // In a real application, you would use these parameters to filter the data
  return leadService.getLeads().then(response => {
    if (response.success && response.data) {
      let filteredLeads = response.data;
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredLeads = filteredLeads.filter(lead => 
          lead.name.toLowerCase().includes(query) || 
          lead.email.toLowerCase().includes(query) || 
          lead.company.toLowerCase().includes(query)
        );
      }
      
      // Filter by source
      if (leadSource && leadSource !== 'All Sources') {
        filteredLeads = filteredLeads.filter(lead => lead.source === leadSource);
      }
      
      // Filter by status
      if (leadStatus && leadStatus !== 'All Statuses') {
        filteredLeads = filteredLeads.filter(lead => lead.status === leadStatus);
      }
      
      return filteredLeads;
    }
    return [];
  });
};

export const fetchLeadStats = (dateRange: DateRange): Promise<LeadStats> => {
  return leadService.getLeadStats().then(response => {
    if (response.success && response.data) {
      return response.data;
    }
    return {
      totalLeads: 0,
      newLeads: 0,
      qualifiedLeads: 0,
      conversionRate: 0,
      leadsBySource: [],
      leadsByStatus: [],
      leadTrend: []
    };
  });
};
