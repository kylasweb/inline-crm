/**
 * Types for Presales Management Module
 */

/**
 * Status types for presales entities
 */
export enum PresalesStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Priority levels for presales requests
 */
export enum PriorityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Technical requirements for a presales request
 */
export interface TechnicalRequirements {
  infrastructure: string[];
  integrations: string[];
  security: string[];
  performance: string[];
  customization: string[];
  additionalNotes?: string;
}

/**
 * Resource allocation details
 */
export interface ResourceAllocation {
  resourceId: string;
  role: string;
  allocatedHours: number;
  startDate: Date;
  endDate: Date;
  skillsets: string[];
  availability: number;
}

/**
 * Timeline tracking for presales activities
 */
export interface TimelineItem {
  id: string;
  activity: string;
  startDate: Date;
  endDate: Date;
  status: PresalesStatus;
  assignedTo: string[];
  dependencies?: string[];
  completionPercentage: number;
}

/**
 * Deliverable status tracking
 */
export interface Deliverable {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: PresalesStatus;
  assignedTo: string[];
  reviewers: string[];
  attachments?: string[];
  comments?: string[];
}

/**
 * POC (Proof of Concept) details
 */
export interface POCDetails {
  id: string;
  objectives: string[];
  scope: string;
  success_criteria: string[];
  environment: string;
  timeline: TimelineItem[];
  resources: ResourceAllocation[];
  deliverables: Deliverable[];
  technical_requirements: TechnicalRequirements;
  status: PresalesStatus;
}

/**
 * Main presales request interface
 */
export interface PresalesRequest {
  id: string;
  opportunityId: string;
  accountId: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  requestDate: Date;
  expectedCompletionDate: Date;
  status: PresalesStatus;
  poc?: POCDetails;
  timeline: TimelineItem[];
  resources: ResourceAllocation[];
  deliverables: Deliverable[];
  technicalRequirements: TechnicalRequirements;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}