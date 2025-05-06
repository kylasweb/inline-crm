/**
 * @module IntegrationTypes
 * @description Defines the types for ERP, HRMS, and ITSM integrations.
 */

/**
 * @typedef ERPIntegration
 * @description Represents an ERP integration configuration.
 */
export interface ERPIntegration {
  id: string;
  name: string;
  description?: string;
  connectionDetails: any; // Placeholder for connection details
  dataMappingId?: string;
  syncScheduleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef HRMSIntegration
 * @description Represents an HRMS integration configuration.
 */
export interface HRMSIntegration {
  id: string;
  name: string;
  description?: string;
  connectionDetails: any; // Placeholder for connection details
  dataMappingId?: string;
  syncScheduleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef ITSMIntegration
 * @description Represents an ITSM integration configuration.
 */
export interface ITSMIntegration {
  id: string;
  name: string;
  description?: string;
  connectionDetails: any; // Placeholder for connection details
  dataMappingId?: string;
  syncScheduleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef DataMapping
 * @description Represents the mapping between data fields in the integration.
 */
export interface DataMapping {
  id: string;
  name: string;
  description?: string;
  sourceFields: any; // Placeholder for source fields
  targetFields: any; // Placeholder for target fields
  transformationRules?: any; // Placeholder for transformation rules
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef SyncSchedule
 * @description Represents the schedule for data synchronization.
 */
export interface SyncSchedule {
  id: string;
  name: string;
  description?: string;
  cronExpression: string;
  nextSync: Date;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef Log
 * @description Represents a log entry for integration activities.
 */
export interface Log {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: any; // Placeholder for additional context
  integrationId?: string;
}