import { Lead } from '../api';

// Extended Lead type with assignment-specific fields
export interface ExtendedLead extends Lead {
  region?: string;
  priority?: number;
  industry?: string;
  dealSize?: number;
  customFields?: Record<string, any>;
}

export interface AssignmentRule {
  id: string;
  name: string;
  priority: number;
  conditions: RuleCondition[];
  action: AssignmentAction;
  isActive: boolean;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface AssignmentAction {
  type: 'assign_to_user' | 'assign_to_team' | 'round_robin' | 'load_balance';
  target: string; // User ID or Team ID
  fallback?: string; // Fallback user/team if primary assignment fails
}

export interface Territory {
  id: string;
  name: string;
  regions: string[];
  assignedUsers: string[];
  priority: number;
}

export interface TeamMemberCapacity {
  userId: string;
  maxLeads: number;
  currentLeads: number;
  specialties: string[];
  availability: boolean;
  territory?: string;
}

export interface AssignmentHistory {
  leadId: string;
  assignedTo: string;
  assignedBy: string;
  assignmentDate: Date;
  ruleName?: string;
  territoryId?: string;
  assignmentType: 'rule' | 'round_robin' | 'load_balance' | 'territory' | 'priority' | 'manual';
}

export interface AssignmentMetrics {
  userId: string;
  totalAssignments: number;
  successfulAssignments: number;
  assignmentRate: number;
  averageResponseTime: number;
  conversionRate: number;
}

export interface AssignmentResult {
  success: boolean;
  assignedTo?: string;
  rule?: AssignmentRule;
  territory?: Territory;
  reason?: string;
  timestamp: Date;
}

export interface AssignmentQueueItem {
  lead: ExtendedLead;
  priority: number;
  attempts: number;
  lastAttempt?: Date;
  preferredAssignee?: string;
}

export type AssignmentStrategy = 'rule_based' | 'round_robin' | 'load_balance' | 'territory' | 'priority';

export interface AssignmentConfig {
  defaultStrategy: AssignmentStrategy;
  maxAttempts: number;
  retryDelayMinutes: number;
  workHoursOnly: boolean;
  allowReassignment: boolean;
  notifyOnAssignment: boolean;
}