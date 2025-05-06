import { ApiResponse, fetchData, postData, updateData, deleteData } from '../api';
import { Quotation, CreateQuotationDTO, UpdateQuotationDTO } from './quotationTypes';

const BASE_URL = '/quotations';

export const quotationService = {
  async getAll(): Promise<ApiResponse<Quotation[]>> {
    const response = await fetchData<Quotation[]>(BASE_URL);
    return {
      ...response,
      data: response.data || []
    };
  },

  async getById(id: string): Promise<ApiResponse<Quotation>> {
    const response = await fetchData<Quotation>(`${BASE_URL}/${id}`);
    if (!response.data) {
      return {
        success: false,
        error: 'Quotation not found'
      };
    }
    return response;
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

    const response = await updateData<Quotation>(`${BASE_URL}/${id}`, quotationUpdate);
    if (!response.data) {
      return {
        success: false,
        error: 'Failed to update quotation'
      };
    }
    return response;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await deleteData(`${BASE_URL}/${id}`);
    if (!response.success) {
      return {
        success: false,
        error: 'Failed to delete quotation'
      };
    }
    return response;
  },

  async send(id: string): Promise<ApiResponse<Quotation>> {
    const response = await updateData<Quotation>(`${BASE_URL}/${id}`, { status: 'sent' });
    if (!response.data) {
      return {
        success: false,
        error: 'Failed to send quotation'
      };
    }
    return response;
  },

  async accept(id: string): Promise<ApiResponse<Quotation>> {
    const response = await updateData<Quotation>(`${BASE_URL}/${id}`, { status: 'accepted' });
    if (!response.data) {
      return {
        success: false,
        error: 'Failed to accept quotation'
      };
    }
    return response;
  },

  async reject(id: string): Promise<ApiResponse<Quotation>> {
    const response = await updateData<Quotation>(`${BASE_URL}/${id}`, { status: 'rejected' });
    if (!response.data) {
      return {
        success: false,
        error: 'Failed to reject quotation'
      };
    }
    return response;
  }
};

export default quotationService;