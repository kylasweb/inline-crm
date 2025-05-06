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

export interface Forecast {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  targetRevenue: number;
  currency: string;
  opportunityIds: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  description: string;
}

export interface SalesCycle {
  id: string;
  name: string;
  stages: string[];
  averageDuration: number;
}

export interface Metric {
  name: string;
  value: number;
  date: Date;
  description: string;
}