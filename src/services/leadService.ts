import { fetchData, postData, updateData, deleteData, ApiResponse, Lead } from './api';
import { FormDefinition } from '../components/leads/types';
import { qualificationService } from './qualification/qualificationService';
import { QualificationResult } from './qualification/qualificationTypes';
import { assignmentService } from './assignment/assignmentService';
import { AssignmentResult } from './assignment/assignmentTypes';
import { enrichmentService } from './enrichment/enrichmentService';
import { LeadEnrichmentData } from './enrichment/enrichmentTypes';

// Make interfaces compatible with Record<string, unknown>
export interface LeadFormData extends Record<string, unknown> {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  notes?: string;
}

export interface LeadScoringRule extends Record<string, unknown> {
  id: string;
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
  score: number;
  priority: number;
}

export interface LeadAssignmentRule extends Record<string, unknown> {
  id: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: any;
  }>;
  assignTo: string;
  priority: number;
}

export interface LeadStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  leadsBySource: { source: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  leadTrend: { date: string; leads: number }[];
}

export interface LeadFormValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export const leadService = {
  // Core CRUD operations
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
    const response = await postData<Lead>('/leads', leadData as Record<string, unknown>);
    if (response.success && response.data) {
      const enrichmentData = await enrichmentService.enrichLead(response.data);
      
      if (enrichmentData.company || enrichmentData.contact) {
        const enrichedLeadData: Partial<LeadFormData> = {};
        
        if (enrichmentData.company) {
          enrichedLeadData.company = enrichmentData.company.name;
        }
        
        if (enrichmentData.contact) {
          if (enrichmentData.contact.email.valid) {
            enrichedLeadData.email = response.data.email;
          }
          if (enrichmentData.contact.phone.valid) {
            enrichedLeadData.phone = response.data.phone;
          }
        }
        
        await this.updateLead(response.data.id, enrichedLeadData);
      }

      // Calculate qualification score for enriched lead
      const qualificationResult = await qualificationService.calculateLeadScore(response.data);
      
      // Update lead with qualification data
      const qualifiedLead = await this.updateLeadQualification(response.data.id, qualificationResult);
      
      if (qualifiedLead.success && qualifiedLead.data) {
        // Assign the lead based on qualification and rules
        const assignmentResult = await assignmentService.assignLead(qualifiedLead.data);
        
        if (assignmentResult.success && assignmentResult.assignedTo) {
          // Update lead with assignment
          await this.updateLead(qualifiedLead.data.id, {
            assignedTo: assignmentResult.assignedTo
          });
        }
      }
      
      return response;
    }
    return response;
  },

  // Enrichment methods
  async getLeadEnrichment(leadId: string): Promise<ApiResponse<LeadEnrichmentData>> {
    try {
      const leadResponse = await this.getLeadById(leadId);
      if (!leadResponse.success || !leadResponse.data) {
        return { success: false, error: 'Lead not found' };
      }

      const enrichmentData = await enrichmentService.enrichLead(leadResponse.data);
      return { success: true, data: enrichmentData };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch enrichment data'
      };
    }
  },

  async refreshLeadEnrichment(leadId: string): Promise<ApiResponse<LeadEnrichmentData>> {
    try {
      const leadResponse = await this.getLeadById(leadId);
      if (!leadResponse.success || !leadResponse.data) {
        return { success: false, error: 'Lead not found' };
      }

      const enrichmentData = await enrichmentService.refreshEnrichment(leadResponse.data);
      return { success: true, data: enrichmentData };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh enrichment data'
      };
    }
  },

  async getEnrichmentStatus(leadId: string): Promise<ApiResponse<string>> {
    try {
      const status = await enrichmentService.getEnrichmentStatus(leadId);
      return {
        success: true,
        data: status?.status || 'unknown'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get enrichment status'
      };
    }
  },

  // Update lead qualification data
  async updateLeadQualification(leadId: string, qualificationData: QualificationResult & Record<string, unknown>): Promise<ApiResponse<Lead>> {
    return updateData<Lead>(`/leads/${leadId}/qualification`, qualificationData);
  },

  // Get lead qualification data
  async getLeadQualification(leadId: string): Promise<ApiResponse<QualificationResult>> {
    return fetchData<QualificationResult>(`/leads/${leadId}/qualification`);
  },

  // Trigger lead requalification
  async requalifyLead(leadId: string): Promise<ApiResponse<QualificationResult>> {
    const leadResponse = await this.getLeadById(leadId);
    if (leadResponse.success && leadResponse.data) {
      const qualificationResult = await qualificationService.calculateLeadScore(leadResponse.data);
      await this.updateLeadQualification(leadId, qualificationResult);
      return { success: true, data: qualificationResult };
    }
    return { success: false, error: 'Lead not found' };
  },
  
  async updateLead(id: string, leadData: Partial<LeadFormData>): Promise<ApiResponse<Lead>> {
    return updateData<Lead>(`/leads/${id}`, leadData as Record<string, unknown>);
  },
  
  async deleteLead(id: string): Promise<ApiResponse<void>> {
    return deleteData(`/leads/${id}`);
  },

  // Form configuration methods
  async getFormConfigurations(): Promise<ApiResponse<FormDefinition[]>> {
    return fetchData<FormDefinition[]>('/lead-config/forms');
  },

  async getFormConfigurationById(id: string): Promise<ApiResponse<FormDefinition>> {
    return fetchData<FormDefinition>(`/lead-config/forms/${id}`);
  },

  async createFormConfiguration(config: FormDefinition & Record<string, unknown>): Promise<ApiResponse<FormDefinition>> {
    return postData<FormDefinition>('/lead-config/forms', config);
  },

  async updateFormConfiguration(id: string, config: Partial<FormDefinition>): Promise<ApiResponse<FormDefinition>> {
    return updateData<FormDefinition>(`/lead-config/forms/${id}`, config as Record<string, unknown>);
  },

  async deleteFormConfiguration(id: string): Promise<ApiResponse<void>> {
    return deleteData(`/lead-config/forms/${id}`);
  },

  // Lead scoring methods
  async getScoringRules(): Promise<ApiResponse<LeadScoringRule[]>> {
    return fetchData<LeadScoringRule[]>('/lead-config/scoring-rules');
  },

  async createScoringRule(rule: LeadScoringRule): Promise<ApiResponse<LeadScoringRule>> {
    return postData<LeadScoringRule>('/lead-config/scoring-rules', rule);
  },

  async updateScoringRule(id: string, rule: Partial<LeadScoringRule>): Promise<ApiResponse<LeadScoringRule>> {
    return updateData<LeadScoringRule>(`/lead-config/scoring-rules/${id}`, rule as Record<string, unknown>);
  },

  async deleteScoringRule(id: string): Promise<ApiResponse<void>> {
    return deleteData(`/lead-config/scoring-rules/${id}`);
  },

  // Lead assignment methods
  async getAssignmentRules(): Promise<ApiResponse<LeadAssignmentRule[]>> {
    return fetchData<LeadAssignmentRule[]>('/lead-config/assignment-rules');
  },

  async createAssignmentRule(rule: LeadAssignmentRule): Promise<ApiResponse<LeadAssignmentRule>> {
    return postData<LeadAssignmentRule>('/lead-config/assignment-rules', rule);
  },

  async updateAssignmentRule(id: string, rule: Partial<LeadAssignmentRule>): Promise<ApiResponse<LeadAssignmentRule>> {
    return updateData<LeadAssignmentRule>(`/lead-config/assignment-rules/${id}`, rule as Record<string, unknown>);
  },

  async deleteAssignmentRule(id: string): Promise<ApiResponse<void>> {
    return deleteData(`/lead-config/assignment-rules/${id}`);
  },

  // Lead form submission and validation
  async validateFormData(formId: string, data: Record<string, any>): Promise<ApiResponse<LeadFormValidationResult>> {
    return postData<LeadFormValidationResult>(`/lead-config/forms/${formId}/validate`, data);
  },

  async submitLeadForm(formId: string, data: Record<string, any>): Promise<ApiResponse<Lead>> {
    return postData<Lead>(`/lead-config/forms/${formId}/submit`, data);
  },

  async calculateLeadScore(leadId: string): Promise<ApiResponse<number>> {
    return fetchData<number>(`/leads/${leadId}/score`);
  },
};

// Helper functions for lead management
export const fetchLeads = (dateRange: DateRange, searchQuery: string, leadSource: string, leadStatus: string): Promise<Lead[]> => {
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

interface DateRange {
  from: Date;
  to?: Date;
}

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
