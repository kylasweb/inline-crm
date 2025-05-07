/**
 * @module IntegrationTypes.test
 * @description Implements unit tests for integrationTypes.ts.
 */

import '@jest/globals';
import { describe, expect, it } from '@jest/globals';
import { ERPIntegration, HRMSIntegration, ITSMIntegration, DataMapping, SyncSchedule, Log } from './integrationTypes';

describe('Integration Types', () => {
  it('should define ERPIntegration type', () => {
    const erpIntegration: ERPIntegration = {
      id: '1',
      name: 'Test ERP Integration',
      connectionDetails: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(erpIntegration).toBeDefined();
  });

  it('should define HRMSIntegration type', () => {
    const hrmsIntegration: HRMSIntegration = {
      id: '2',
      name: 'Test HRMS Integration',
      connectionDetails: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(hrmsIntegration).toBeDefined();
  });

  it('should define ITSMIntegration type', () => {
    const itsmIntegration: ITSMIntegration = {
      id: '3',
      name: 'Test ITSM Integration',
      connectionDetails: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(itsmIntegration).toBeDefined();
  });

  it('should define DataMapping type', () => {
    const dataMapping: DataMapping = {
      id: '4',
      name: 'Test Data Mapping',
      sourceFields: {},
      targetFields: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(dataMapping).toBeDefined();
  });

  it('should define SyncSchedule type', () => {
    const syncSchedule: SyncSchedule = {
      id: '5',
      name: 'Test Sync Schedule',
      cronExpression: '0 0 * * *',
      nextSync: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(syncSchedule).toBeDefined();
  });

  it('should define Log type', () => {
    const log: Log = {
      id: '6',
      timestamp: new Date(),
      level: 'info',
      message: 'Test log message',
    };
    expect(log).toBeDefined();
  });
});