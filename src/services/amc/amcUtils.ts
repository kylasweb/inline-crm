import { AMCContract, License, ContractStatus, RenewalStatus, PaymentTerms } from './amcTypes';

/**
 * Generate a unique license key
 * Format: XXXX-XXXX-XXXX-XXXX where X is alphanumeric
 */
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = Array(4).fill(null).map(() => 
    Array(4).fill(null)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('')
  );
  return segments.join('-');
}

/**
 * Validate contract data before creation or update
 */
export function validateContract(contract: Partial<AMCContract>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!contract.customerId) errors.push('Customer ID is required');
  if (!contract.startDate) errors.push('Start date is required');
  if (!contract.endDate) errors.push('End date is required');
  if (!contract.paymentTerms) errors.push('Payment terms are required');

  // Date validation
  if (contract.startDate && contract.endDate) {
    const start = new Date(contract.startDate);
    const end = new Date(contract.endDate);
    if (end <= start) {
      errors.push('End date must be after start date');
    }
  }

  // Payment terms validation
  if (contract.paymentTerms) {
    const errors = validatePaymentTerms(contract.paymentTerms);
    errors.forEach(error => errors.push(error));
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate payment terms
 */
function validatePaymentTerms(terms: PaymentTerms): string[] {
  const errors: string[] = [];

  if (terms.amount <= 0) errors.push('Payment amount must be greater than 0');
  if (terms.duration <= 0) errors.push('Payment duration must be greater than 0');
  if (terms.lateFeePercentage < 0) errors.push('Late fee percentage cannot be negative');
  if (terms.gracePeriod < 0) errors.push('Grace period cannot be negative');

  if (!['MONTHLY', 'QUARTERLY', 'YEARLY'].includes(terms.frequency)) {
    errors.push('Invalid payment frequency');
  }

  return errors;
}

/**
 * Calculate expiry date for a license based on contract dates
 */
export function calculateLicenseExpiry(contract: AMCContract): Date {
  // Add grace period to contract end date
  const endDate = new Date(contract.endDate);
  return new Date(endDate.setDate(endDate.getDate() + contract.paymentTerms.gracePeriod));
}

/**
 * Check if a contract needs renewal
 */
export function checkRenewalStatus(contract: AMCContract): RenewalStatus {
  const today = new Date();
  const endDate = new Date(contract.endDate);
  const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (today > endDate) {
    return RenewalStatus.OVERDUE;
  }

  // Consider contract due for renewal if within 30 days of expiry
  if (daysUntilExpiry <= 30) {
    return RenewalStatus.DUE_SOON;
  }

  return RenewalStatus.NOT_DUE;
}

/**
 * Check if a license is valid and active
 */
export function isLicenseValid(license: License): boolean {
  const now = new Date();
  const expiryDate = new Date(license.expiryDate);
  return license.isActive && expiryDate > now;
}

/**
 * Calculate next payment date based on payment terms
 */
export function calculateNextPaymentDate(contract: AMCContract, lastPaymentDate?: Date): Date {
  const baseDate = lastPaymentDate || new Date(contract.startDate);
  const { frequency } = contract.paymentTerms;
  
  let months = 0;
  switch (frequency) {
    case 'MONTHLY':
      months = 1;
      break;
    case 'QUARTERLY':
      months = 3;
      break;
    case 'YEARLY':
      months = 12;
      break;
  }

  const nextDate = new Date(baseDate);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

/**
 * Format renewal notification message
 */
export function formatRenewalNotification(contract: AMCContract): string {
  const endDate = new Date(contract.endDate);
  const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return `Contract ${contract.id} has expired. Please renew immediately to maintain service continuity.`;
  }

  if (daysUntilExpiry <= 30) {
    return `Contract ${contract.id} will expire in ${daysUntilExpiry} days. Please initiate renewal process.`;
  }

  return `Contract ${contract.id} is valid until ${endDate.toLocaleDateString()}.`;
}

/**
 * Calculate total contract value including all payments
 */
export function calculateContractValue(contract: AMCContract): number {
  const { amount, frequency, duration } = contract.paymentTerms;
  let paymentsPerYear: number;

  switch (frequency) {
    case 'MONTHLY':
      paymentsPerYear = 12;
      break;
    case 'QUARTERLY':
      paymentsPerYear = 4;
      break;
    case 'YEARLY':
      paymentsPerYear = 1;
      break;
    default:
      throw new Error('Invalid payment frequency');
  }

  const totalPayments = Math.ceil((duration / 12) * paymentsPerYear);
  return amount * totalPayments;
}

/**
 * Determine contract status based on dates and payments
 */
export function determineContractStatus(contract: AMCContract): ContractStatus {
  const now = new Date();
  const startDate = new Date(contract.startDate);
  const endDate = new Date(contract.endDate);

  if (now < startDate) {
    return ContractStatus.PENDING_RENEWAL;
  }

  if (now > endDate) {
    return ContractStatus.EXPIRED;
  }

  return ContractStatus.ACTIVE;
}