import { fetchData, postData, updateData, deleteData } from '../api';
import { Account, AccountListResponse, AccountResponse, AccountListParams } from './accountTypes';

const BASE_ENDPOINT = '/accounts';

export const accountService = {
  async getAccounts(params?: AccountListParams): Promise<AccountListResponse> {
    const queryParams = params ? new URLSearchParams({
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.search && { search: params.search }),
      ...(params.type && { type: params.type }),
      ...(params.industry && { industry: params.industry }),
    }).toString() : '';

    const endpoint = `${BASE_ENDPOINT}${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetchData<AccountListResponse>(endpoint);
    return response.data || { accounts: [], total: 0 };
  },

  async getAccountById(id: string): Promise<AccountResponse> {
    const response = await fetchData<Account>(`${BASE_ENDPOINT}/${id}`);
    return response;
  },

  async createAccount(data: Partial<Account>): Promise<AccountResponse> {
    const response = await postData<Account>(BASE_ENDPOINT, data);
    return response;
  },

  async updateAccount(id: string, data: Partial<Account>): Promise<AccountResponse> {
    const response = await updateData<Account>(`${BASE_ENDPOINT}/${id}`, data);
    return response;
  },

  async deleteAccount(id: string): Promise<boolean> {
    const response = await deleteData(`${BASE_ENDPOINT}/${id}`);
    return response.success;
  },

  async getAccountContacts(accountId: string) {
    const response = await fetchData<Account>(`${BASE_ENDPOINT}/${accountId}/contacts`);
    return response.data?.contacts || [];
  },

  async addContact(accountId: string, contactData: Omit<Account['contacts'][0], 'id' | 'accountId'>) {
    const response = await postData(`${BASE_ENDPOINT}/${accountId}/contacts`, contactData);
    return response;
  },

  async updateContact(accountId: string, contactId: string, contactData: Partial<Account['contacts'][0]>) {
    const response = await updateData(`${BASE_ENDPOINT}/${accountId}/contacts/${contactId}`, contactData);
    return response;
  },

  async deleteContact(accountId: string, contactId: string) {
    const response = await deleteData(`${BASE_ENDPOINT}/${accountId}/contacts/${contactId}`);
    return response.success;
  },

  async updateAddress(accountId: string, addressId: string, addressData: Partial<Account['addresses'][0]>) {
    const response = await updateData(`${BASE_ENDPOINT}/${accountId}/addresses/${addressId}`, addressData);
    return response;
  },

  async addAddress(accountId: string, addressData: Omit<Account['addresses'][0], 'id'>) {
    const response = await postData(`${BASE_ENDPOINT}/${accountId}/addresses`, addressData);
    return response;
  },

  async deleteAddress(accountId: string, addressId: string) {
    const response = await deleteData(`${BASE_ENDPOINT}/${accountId}/addresses/${addressId}`);
    return response.success;
  }
};