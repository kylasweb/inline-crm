/**
 * AMC Contract status enum
 */
export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING_RENEWAL = 'PENDING_RENEWAL',
  TERMINATED = 'TERMINATED'
}

/**
 * License type enum
 */
export enum LicenseType {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

/**
 * Renewal status enum
 */
export enum RenewalStatus {
  NOT_DUE = 'NOT_DUE',
  DUE_SOON = 'DUE_SOON', 
  OVERDUE = 'OVERDUE',
  RENEWED = 'RENEWED'
}

/**
 * Payment terms interface
 */
export interface PaymentTerms {
  /** Duration in months */
  duration: number;
  /** Amount per term */
  amount: number;
  /** Frequency of payments (monthly/quarterly/yearly) */
  frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  /** Late payment fee percentage */
  lateFeePercentage: number;
  /** Grace period in days */
  gracePeriod: number;
}

/**
 * License interface
 */
export interface License {
  id: string;
  type: LicenseType;
  key: string;
  issuedDate: Date;
  expiryDate: Date;
  maxUsers: number;
  features: string[];
  isActive: boolean;
}

/**
 * AMC Contract interface
 */
export interface AMCContract {
  id: string;
  customerId: string;
  license: License;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;
  renewalStatus: RenewalStatus;
  paymentTerms: PaymentTerms;
  totalValue: number;
  description: string;
  terms: string[];
  lastRenewalDate?: Date;
  nextRenewalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AMC Payment interface
 */
export interface AMCPayment {
  id: string;
  contractId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paymentMethod?: string;
  transactionId?: string;
}

/**
 * Contract renewal request interface
 */
export interface ContractRenewalRequest {
  contractId: string;
  newStartDate: Date;
  newEndDate: Date;
  updatedPaymentTerms?: PaymentTerms;
  updatedLicenseType?: LicenseType;
}

/**
 * Service error types
 */
export enum AMCErrorType {
  CONTRACT_NOT_FOUND = 'CONTRACT_NOT_FOUND',
  LICENSE_EXPIRED = 'LICENSE_EXPIRED',
  INVALID_PAYMENT = 'INVALID_PAYMENT',
  RENEWAL_NOT_DUE = 'RENEWAL_NOT_DUE',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

/**
 * Custom error class for AMC service
 */
export class AMCServiceError extends Error {
  constructor(
    public type: AMCErrorType,
    message: string
  ) {
    super(message);
    this.name = 'AMCServiceError';
  }
}