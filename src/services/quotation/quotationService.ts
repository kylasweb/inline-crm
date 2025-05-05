import { ApiResponse, fetchData, postData, updateData, deleteData } from '../api';
import { Quotation, CreateQuotationDTO, UpdateQuotationDTO } from './quotationTypes';

const BASE_URL = '/quotations';

export const quotationService = {
  async getAll(): Promise<ApiResponse<Quotation[]>> {
    return fetchData<Quotation[]>(BASE_URL);
  },

  async getById(id: string): Promise<ApiResponse<Quotation>> {
    return fetchData<Quotation>(`${BASE_URL}/${id}`);
  },

  async create(data: CreateQuotationDTO): Promise<ApiResponse<Quotation>> {
    // Calculate totals before sending
    const items = data.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100)
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxes = (data.taxes || []).map(tax => ({
      ...tax,
      amount: subtotal * (tax.rate / 100)
    }));
    const total = subtotal + taxes.reduce((sum, tax) => sum + tax.amount, 0);

    const quotationData = {
      ...data,
      items,
      taxes,
      subtotal,
      total,
      status: 'draft' as const
    };

    return postData<Quotation>(BASE_URL, quotationData);
  },

  async update(id: string, data: UpdateQuotationDTO): Promise<ApiResponse<Quotation>> {
    let quotationUpdate: Record<string, unknown> = { ...data };

    // If items are being updated, recalculate totals
    if (data.items) {
      const items = data.items.map(item => ({
        ...item,
        total: item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100)
      }));

      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const taxes = (data.taxes || []).map(tax => ({
        ...tax,
        amount: subtotal * (tax.rate / 100)
      }));
      const total = subtotal + taxes.reduce((sum, tax) => sum + tax.amount, 0);

      quotationUpdate = {
        ...quotationUpdate,
        items,
        taxes,
        subtotal,
        total
      };
    }

    return updateData<Quotation>(`${BASE_URL}/${id}`, quotationUpdate);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return deleteData(`${BASE_URL}/${id}`);
  },

  async send(id: string): Promise<ApiResponse<Quotation>> {
    return updateData<Quotation>(`${BASE_URL}/${id}`, { status: 'sent' });
  },

  async accept(id: string): Promise<ApiResponse<Quotation>> {
    return updateData<Quotation>(`${BASE_URL}/${id}`, { status: 'accepted' });
  },

  async reject(id: string): Promise<ApiResponse<Quotation>> {
    return updateData<Quotation>(`${BASE_URL}/${id}`, { status: 'rejected' });
  }
};

export default quotationService;