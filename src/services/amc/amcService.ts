import { 
  AMCContract, 
  AMCPayment,
  ContractRenewalRequest, 
  ContractStatus,
  License,
  AMCServiceError,
  AMCErrorType,
  RenewalStatus
} from './amcTypes';
import { fetchData, postData, updateData, deleteData } from '../api';

/**
 * Service class for managing AMC contracts and licenses
 */
export class AMCService {
  private readonly baseUrl = '/api/amc';

  /**
   * Create a new AMC contract
   */
  async createContract(contract: Omit<AMCContract, 'id' | 'createdAt' | 'updatedAt'>): Promise<AMCContract> {
    try {
      const response = await postData<AMCContract>(`${this.baseUrl}/contracts`, contract);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data!;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.VALIDATION_ERROR,
        'Failed to create AMC contract'
      );
    }
  }

  /**
   * Get AMC contract by ID
   */
  async getContract(id: string): Promise<AMCContract> {
    try {
      const response = await fetchData<AMCContract>(`${this.baseUrl}/contracts/${id}`);
      if (!response.success || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.CONTRACT_NOT_FOUND,
        `Contract not found with ID: ${id}`
      );
    }
  }

  /**
   * Update existing AMC contract
   */
  async updateContract(id: string, updates: Partial<AMCContract>): Promise<AMCContract> {
    try {
      const response = await updateData<AMCContract>(`${this.baseUrl}/contracts/${id}`, updates);
      if (!response.success || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.VALIDATION_ERROR,
        'Failed to update AMC contract'
      );
    }
  }

  /**
   * Delete AMC contract
   */
  async deleteContract(id: string): Promise<void> {
    try {
      const response = await deleteData(`${this.baseUrl}/contracts/${id}`);
      if (!response.success) {
        throw new Error(response.error);
      }
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.CONTRACT_NOT_FOUND,
        `Failed to delete contract with ID: ${id}`
      );
    }
  }

  /**
   * List all AMC contracts with optional filtering
   */
  async listContracts(filters?: {
    status?: ContractStatus;
    customerId?: string;
    renewalStatus?: RenewalStatus;
  }): Promise<AMCContract[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.customerId) queryParams.append('customerId', filters.customerId);
      if (filters?.renewalStatus) queryParams.append('renewalStatus', filters.renewalStatus);

      const url = `${this.baseUrl}/contracts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetchData<AMCContract[]>(url);
      if (!response.success || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.VALIDATION_ERROR,
        'Failed to fetch AMC contracts'
      );
    }
  }

  /**
   * Process contract renewal
   */
  async renewContract(renewal: ContractRenewalRequest): Promise<AMCContract> {
    try {
      const renewalData: Record<string, unknown> = {
        newStartDate: renewal.newStartDate,
        newEndDate: renewal.newEndDate,
        updatedPaymentTerms: renewal.updatedPaymentTerms,
        updatedLicenseType: renewal.updatedLicenseType
      };

      const response = await postData<AMCContract>(
        `${this.baseUrl}/contracts/${renewal.contractId}/renew`, 
        renewalData
      );
      if (!response.success || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.RENEWAL_NOT_DUE,
        'Failed to process contract renewal'
      );
    }
  }

  /**
   * Create new payment for contract
   */
  async createPayment(payment: Omit<AMCPayment, 'id'>): Promise<AMCPayment> {
    try {
      const response = await postData<AMCPayment>(`${this.baseUrl}/payments`, payment);
      if (!response.success || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.INVALID_PAYMENT,
        'Failed to process payment'
      );
    }
  }

  /**
   * Get payment details by ID
   */
  async getPayment(id: string): Promise<AMCPayment> {
    try {
      const response = await fetchData<AMCPayment>(`${this.baseUrl}/payments/${id}`);
      if (!response.success || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.INVALID_PAYMENT,
        `Payment not found with ID: ${id}`
      );
    }
  }

  /**
   * List payments for a contract
   */
  async listPayments(contractId: string): Promise<AMCPayment[]> {
    try {
      const response = await fetchData<AMCPayment[]>(`${this.baseUrl}/contracts/${contractId}/payments`);
      if (!response.success || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.CONTRACT_NOT_FOUND,
        'Failed to fetch contract payments'
      );
    }
  }

  /**
   * Update contract status
   */
  async updateContractStatus(id: string, status: ContractStatus): Promise<AMCContract> {
    try {
      const statusData: Record<string, unknown> = { status };
      const response = await updateData<AMCContract>(
        `${this.baseUrl}/contracts/${id}/status`, 
        statusData
      );
      if (!response.success || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.CONTRACT_NOT_FOUND,
        'Failed to update contract status'
      );
    }
  }

  /**
   * Activate or deactivate license
   */
  async toggleLicense(contractId: string, active: boolean): Promise<License> {
    try {
      const licenseData: Record<string, unknown> = { active };
      const response = await updateData<License>(
        `${this.baseUrl}/contracts/${contractId}/license`, 
        licenseData
      );
      if (!response.success || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.LICENSE_EXPIRED,
        'Failed to toggle license status'
      );
    }
  }

  /**
   * Get contract renewal status
   */
  async getRenewalStatus(contractId: string): Promise<RenewalStatus> {
    try {
      const response = await fetchData<{ status: RenewalStatus }>(`${this.baseUrl}/contracts/${contractId}/renewal-status`);
      if (!response.success || !response.data) {
        throw new Error(response.error);
      }
      return response.data.status;
    } catch (error) {
      throw new AMCServiceError(
        AMCErrorType.CONTRACT_NOT_FOUND,
        'Failed to get renewal status'
      );
    }
  }
}