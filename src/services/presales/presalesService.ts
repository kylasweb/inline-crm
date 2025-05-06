import { 
  PresalesRequest, 
  POCDetails, 
  ResourceAllocation, 
  TimelineItem, 
  Deliverable, 
  PresalesStatus,
  PriorityLevel
} from './presalesTypes';
import { fetchData, postData, updateData, deleteData } from '../api';

/**
 * Service for managing presales operations
 */
export class PresalesService {
  private static BASE_URL = '/api/presales';

  /**
   * Create a new presales request
   */
  static async createRequest(request: Omit<PresalesRequest, 'id'>): Promise<PresalesRequest> {
    const response = await postData<PresalesRequest>(
      `${this.BASE_URL}/requests`,
      request as unknown as Record<string, unknown>
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Update an existing presales request
   */
  static async updateRequest(id: string, request: Partial<PresalesRequest>): Promise<PresalesRequest> {
    const response = await updateData<PresalesRequest>(
      `${this.BASE_URL}/requests/${id}`,
      request as unknown as Record<string, unknown>
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Get a presales request by ID
   */
  static async getRequest(id: string): Promise<PresalesRequest> {
    const response = await fetchData<PresalesRequest>(`${this.BASE_URL}/requests/${id}`);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Get all presales requests with optional filters
   */
  static async getRequests(filters?: {
    status?: PresalesStatus;
    priority?: PriorityLevel;
    accountId?: string;
    opportunityId?: string;
  }): Promise<PresalesRequest[]> {
    const queryParams = filters ? 
      `?${Object.entries(filters).map(([k, v]) => `${k}=${v}`).join('&')}` : 
      '';
    const response = await fetchData<PresalesRequest[]>(`${this.BASE_URL}/requests${queryParams}`);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Delete a presales request
   */
  static async deleteRequest(id: string): Promise<void> {
    const response = await deleteData(`${this.BASE_URL}/requests/${id}`);
    if (!response.success) throw new Error(response.error);
  }

  /**
   * Create or update POC details for a presales request
   */
  static async updatePOC(requestId: string, pocDetails: POCDetails): Promise<POCDetails> {
    const response = await updateData<POCDetails>(
      `${this.BASE_URL}/requests/${requestId}/poc`,
      pocDetails as unknown as Record<string, unknown>
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Allocate resources to a presales request
   */
  static async allocateResources(
    requestId: string, 
    resources: ResourceAllocation[]
  ): Promise<ResourceAllocation[]> {
    const response = await postData<ResourceAllocation[]>(
      `${this.BASE_URL}/requests/${requestId}/resources`,
      { resources } as unknown as Record<string, unknown>
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Update resource allocation
   */
  static async updateResourceAllocation(
    requestId: string,
    resourceId: string,
    allocation: Partial<ResourceAllocation>
  ): Promise<ResourceAllocation> {
    const response = await updateData<ResourceAllocation>(
      `${this.BASE_URL}/requests/${requestId}/resources/${resourceId}`,
      allocation as unknown as Record<string, unknown>
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Add timeline item to a presales request
   */
  static async addTimelineItem(
    requestId: string,
    timelineItem: Omit<TimelineItem, 'id'>
  ): Promise<TimelineItem> {
    const response = await postData<TimelineItem>(
      `${this.BASE_URL}/requests/${requestId}/timeline`,
      timelineItem as unknown as Record<string, unknown>
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Update timeline item status
   */
  static async updateTimelineStatus(
    requestId: string,
    itemId: string,
    status: PresalesStatus,
    completionPercentage: number
  ): Promise<TimelineItem> {
    const response = await updateData<TimelineItem>(
      `${this.BASE_URL}/requests/${requestId}/timeline/${itemId}`,
      { status, completionPercentage } as Record<string, unknown>
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Create deliverable for a presales request
   */
  static async createDeliverable(
    requestId: string,
    deliverable: Omit<Deliverable, 'id'>
  ): Promise<Deliverable> {
    const response = await postData<Deliverable>(
      `${this.BASE_URL}/requests/${requestId}/deliverables`,
      deliverable as unknown as Record<string, unknown>
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Update deliverable status
   */
  static async updateDeliverableStatus(
    requestId: string,
    deliverableId: string,
    status: PresalesStatus,
    comments?: string[]
  ): Promise<Deliverable> {
    const response = await updateData<Deliverable>(
      `${this.BASE_URL}/requests/${requestId}/deliverables/${deliverableId}`,
      { status, comments } as Record<string, unknown>
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Get resource availability for a date range
   */
  static async getResourceAvailability(
    startDate: Date,
    endDate: Date,
    resourceIds?: string[]
  ): Promise<Record<string, number>> {
    const queryParams = `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}${
      resourceIds ? `&resourceIds=${resourceIds.join(',')}` : ''
    }`;
    const response = await fetchData<Record<string, number>>(
      `${this.BASE_URL}/resources/availability${queryParams}`
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  /**
   * Update overall presales request status
   */
  static async updateRequestStatus(
    requestId: string,
    status: PresalesStatus
  ): Promise<PresalesRequest> {
    const response = await updateData<PresalesRequest>(
      `${this.BASE_URL}/requests/${requestId}/status`,
      { status } as Record<string, unknown>
    );
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }
}