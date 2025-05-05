export interface Account {
  id: string;
  name: string;
  type: 'customer' | 'prospect' | 'partner';
  industry: string;
  contacts: Contact[];
  addresses: Address[];
  metadata: Record<string, any>;
}

export interface Contact {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping' | 'other';
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
}

export interface AccountListResponse {
  accounts: Account[];
  total: number;
}

export interface AccountResponse {
  success: boolean;
  data?: Account;
  error?: string;
}

export interface AccountListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: Account['type'];
  industry?: string;
}