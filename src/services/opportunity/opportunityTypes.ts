import { ApiResponse } from '../api';

export enum OpportunityStage {
  QUALIFICATION = 'qualification',
  NEEDS_ANALYSIS = 'needs_analysis',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSING = 'closing'
}

export enum OpportunityStatus {
  OPEN = 'open',
  WON = 'won',
  LOST = 'lost',
  SUSPENDED = 'suspended'
}

export interface OpportunityProduct {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: {
    type: 'percentage' | 'amount';
    value: number;
  };
  total: number;
  metadata: Record<string, any>;
}

export interface Opportunity {
  id: string;
  name: string;
  description: string;
  source: {
    type: 'lead' | 'direct' | 'referral';
    id?: string;
  };
  accountId: string;
  stage: OpportunityStage;
  value: {
    amount: number;
    currency: string;
    recurringValue?: number;
    recurringPeriod?: 'monthly' | 'yearly';
  };
  probability: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  products: OpportunityProduct[];
  assignedTo: string;
  status: OpportunityStatus;
  priority: 'low' | 'medium' | 'high';
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpportunityDTO extends Record<string, unknown> {
  name: string;
  description: string;
  source: {
    type: 'lead' | 'direct' | 'referral';
    id?: string;
  };
  accountId: string;
  value: {
    amount: number;
    currency: string;
    recurringValue?: number;
    recurringPeriod?: 'monthly' | 'yearly';
  };
  expectedCloseDate: string;
  products?: OpportunityProduct[];
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

export interface UpdateOpportunityDTO extends Partial<CreateOpportunityDTO>, Record<string, unknown> {
  stage?: OpportunityStage;
  status?: OpportunityStatus;
  actualCloseDate?: string;
}

export interface CloseOpportunityDTO extends Record<string, unknown> {
  status: 'won' | 'lost';
  actualCloseDate: string;
  reason?: string;
  finalValue?: {
    amount: number;
    currency: string;
  };
}

export interface OpportunityFilters {
  stage?: OpportunityStage;
  status?: OpportunityStatus;
  assignedTo?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  minValue?: number;
  maxValue?: number;
  priority?: 'low' | 'medium' | 'high';
  source?: 'lead' | 'direct' | 'referral';
}

export interface OpportunityAnalytics {
  totalValue: number;
  avgDealSize: number;
  winRate: number;
  salesCycle: number;
  pipelineValue: Record<OpportunityStage, number>;
  forecastValue: number;
  conversionRates: {
    stageTransitions: Record<OpportunityStage, number>;
    leadToOpportunity: number;
    opportunityToWon: number;
  };
}

export interface OpportunityForecast {
  period: 'monthly' | 'quarterly' | 'yearly';
  expectedValue: number;
  weightedValue: number;
  probability: number;
  opportunities: Array<{
    id: string;
    value: number;
    probability: number;
    expectedCloseDate: string;
  }>;
}

export interface OpportunityService {
  getAll(filters?: OpportunityFilters): Promise<ApiResponse<Opportunity[]>>;
  getById(id: string): Promise<ApiResponse<Opportunity>>;
  create(data: CreateOpportunityDTO): Promise<ApiResponse<Opportunity>>;
  update(id: string, data: UpdateOpportunityDTO): Promise<ApiResponse<Opportunity>>;
  delete(id: string): Promise<ApiResponse<void>>;
  convertLeadToOpportunity(leadId: string): Promise<ApiResponse<Opportunity>>;
  updateStage(id: string, stage: OpportunityStage): Promise<ApiResponse<Opportunity>>;
  markAsWon(id: string, closeData: CloseOpportunityDTO): Promise<ApiResponse<Opportunity>>;
  markAsLost(id: string, reason: string): Promise<ApiResponse<Opportunity>>;
  reassign(id: string, assigneeId: string): Promise<ApiResponse<Opportunity>>;
  getAnalytics(filters?: OpportunityFilters): Promise<ApiResponse<OpportunityAnalytics>>;
  getForecast(period: string): Promise<ApiResponse<OpportunityForecast>>;
}