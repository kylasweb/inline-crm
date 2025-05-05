
import { fetchData, postData, updateData, deleteData, ApiResponse } from './api';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  createdAt: string;
  status: string;
  source: string;
  score: number;
  assignedTo: string;
  lastContact: string | null;
  notes: string;
}

export interface LeadStats {
  totalLeads: number;
  newLeadsToday: number;
  leadsBySource: { source: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  conversionRate: number;
  averageResponseTime: number;
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
  
  async deleteLead(id: string): Promise<ApiResponse> {
    return deleteData(`/leads/${id}`);
  }
};
