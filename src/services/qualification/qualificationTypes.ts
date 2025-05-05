import { Lead } from '../api';

// Demographic scoring criteria
export interface DemographicCriteria {
  companySize?: number;
  industry?: string;
  location?: string;
  revenue?: number;
  employeeCount?: number;
}

// Engagement metrics
export interface EngagementMetrics {
  websiteVisits: number;
  emailInteractions: number;
  downloadedContent: string[];
  lastInteractionDate: Date;
  totalTimeSpent: number;
  formSubmissions: number;
}

// Lead score components
export interface LeadScoreComponents {
  demographicScore: number;
  companyScore: number;
  engagementScore: number;
  customScore: number;
}

// Qualification status
export enum QualificationStatus {
  UNQUALIFIED = 'UNQUALIFIED',
  IN_PROGRESS = 'IN_PROGRESS',
  MARKETING_QUALIFIED = 'MARKETING_QUALIFIED',
  SALES_QUALIFIED = 'SALES_QUALIFIED',
  DISQUALIFIED = 'DISQUALIFIED'
}

// Rule condition
export interface RuleCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
  secondaryValue?: any; // For 'between' operator
}

// Scoring rule
export interface ScoringRule {
  id: string;
  name: string;
  description?: string;
  conditions: RuleCondition[];
  score: number;
  category: 'demographic' | 'company' | 'engagement' | 'custom';
  priority: number;
  isActive: boolean;
}

// Lead qualification result
export interface QualificationResult {
  leadId: string;
  totalScore: number;
  scoreComponents: LeadScoreComponents;
  status: QualificationStatus;
  qualifiedAt?: Date;
  lastUpdated: Date;
  appliedRules: string[];
}

// Rule evaluation result
export interface RuleEvaluationResult {
  ruleId: string;
  matched: boolean;
  score: number;
  category: string;
}

// Lead with qualification data
export interface QualifiedLead extends Lead {
  qualificationData: QualificationResult;
}