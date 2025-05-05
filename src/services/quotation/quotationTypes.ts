export interface Tax {
  name: string;
  rate: number;
  amount: number;
}

export interface QuotationItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface Quotation {
  id: string;
  opportunityId: string;
  accountId: string;
  items: QuotationItem[];
  subtotal: number;
  taxes: Tax[];
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuotationDTO {
  opportunityId: string;
  accountId: string;
  items: Omit<QuotationItem, 'id'>[];
  taxes?: Omit<Tax, 'amount'>[];
  validUntil: Date;
  metadata?: Record<string, any>;
}

export interface UpdateQuotationDTO {
  items?: Omit<QuotationItem, 'id'>[];
  taxes?: Omit<Tax, 'amount'>[];
  status?: Quotation['status'];
  validUntil?: Date;
  metadata?: Record<string, any>;
}