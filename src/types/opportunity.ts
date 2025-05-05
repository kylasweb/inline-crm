export enum OpportunityStage {
  Qualification = 'qualification',
  NeedsAnalysis = 'needs_analysis',
  Proposal = 'proposal',
  Negotiation = 'negotiation',
  Closing = 'closing'
}

export enum OpportunityStatus {
  Open = 'open',
  Won = 'won',
  Lost = 'lost',
  Suspended = 'suspended'
}

export interface OpportunityProduct {
  id?: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount?: {
    type: 'percentage' | 'amount';
    value: number;
  };
  total?: number;
  metadata?: Record<string, unknown>;
}

export interface OpportunityValue {
  amount: number;
  currency: string;
  recurringValue?: number;
  recurringPeriod?: 'monthly' | 'yearly';
}

export interface BaseOpportunity {
  id: string;
  name: string;
  description: string;
  client: string;
  value: OpportunityValue;
  stage: string;
  closeDate: string;
  probability: number;
  owner: string;
  products: OpportunityProduct[];
  source: {
    type: 'lead' | 'direct' | 'referral';
    id?: string;
  };
  accountId: string;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Opportunity extends BaseOpportunity {
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'won' | 'lost' | 'suspended';
}

export type CreateOpportunityDTO = Omit<BaseOpportunity, 'id'>;