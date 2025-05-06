import { 
  PresalesRequest,
  POCDetails,
  TimelineItem,
  ResourceAllocation,
  Deliverable,
  PresalesStatus,
  PriorityLevel
} from './presalesTypes';

/**
 * Validate a presales request
 */
export function validatePresalesRequest(request: Partial<PresalesRequest>): string[] {
  const errors: string[] = [];

  if (!request.title?.trim()) {
    errors.push('Title is required');
  }

  if (!request.description?.trim()) {
    errors.push('Description is required');
  }

  if (!request.opportunityId) {
    errors.push('Opportunity ID is required');
  }

  if (!request.accountId) {
    errors.push('Account ID is required');
  }

  if (request.expectedCompletionDate && request.requestDate) {
    if (new Date(request.expectedCompletionDate) <= new Date(request.requestDate)) {
      errors.push('Expected completion date must be after request date');
    }
  }

  return errors;
}

/**
 * Calculate the timeline duration in days
 */
export function calculateTimelineDuration(timeline: TimelineItem[]): number {
  if (!timeline.length) return 0;

  const startDates = timeline.map(item => new Date(item.startDate));
  const endDates = timeline.map(item => new Date(item.endDate));
  
  const earliestStart = new Date(Math.min(...startDates.map(date => date.getTime())));
  const latestEnd = new Date(Math.max(...endDates.map(date => date.getTime())));
  
  return Math.ceil((latestEnd.getTime() - earliestStart.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Check resource availability for a given timeframe
 */
export function checkResourceAvailability(
  resources: ResourceAllocation[],
  existingAllocations: ResourceAllocation[]
): ResourceAllocation[] {
  return resources.map(resource => {
    const overlappingAllocations = existingAllocations.filter(existing => 
      existing.resourceId === resource.resourceId &&
      new Date(existing.startDate) <= new Date(resource.endDate) &&
      new Date(existing.endDate) >= new Date(resource.startDate)
    );

    const totalAllocated = overlappingAllocations.reduce(
      (sum, allocation) => sum + allocation.allocatedHours,
      0
    );

    return {
      ...resource,
      availability: Math.max(0, 100 - (totalAllocated / resource.allocatedHours) * 100)
    };
  });
}

/**
 * Calculate overall status based on deliverables and timeline
 */
export function calculateOverallStatus(
  timeline: TimelineItem[],
  deliverables: Deliverable[]
): PresalesStatus {
  if (!timeline.length && !deliverables.length) {
    return PresalesStatus.NEW;
  }

  const allCompleted = [...timeline, ...deliverables]
    .every(item => item.status === PresalesStatus.COMPLETED);
  
  if (allCompleted) {
    return PresalesStatus.COMPLETED;
  }

  const anyInProgress = [...timeline, ...deliverables]
    .some(item => item.status === PresalesStatus.IN_PROGRESS);
  
  if (anyInProgress) {
    return PresalesStatus.IN_PROGRESS;
  }

  const anyPendingReview = [...timeline, ...deliverables]
    .some(item => item.status === PresalesStatus.PENDING_REVIEW);
  
  if (anyPendingReview) {
    return PresalesStatus.PENDING_REVIEW;
  }

  return PresalesStatus.NEW;
}

/**
 * Calculate priority based on various factors
 */
export function calculatePriority(request: PresalesRequest): PriorityLevel {
  let score = 0;

  // Timeline urgency
  const daysToCompletion = calculateTimelineDuration(request.timeline);
  if (daysToCompletion <= 7) score += 3;
  else if (daysToCompletion <= 14) score += 2;
  else if (daysToCompletion <= 30) score += 1;

  // Resource allocation
  const resourceCount = request.resources.length;
  if (resourceCount >= 5) score += 3;
  else if (resourceCount >= 3) score += 2;
  else if (resourceCount >= 1) score += 1;

  // Technical requirements complexity
  const requirementsCount = Object.values(request.technicalRequirements)
    .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  if (requirementsCount >= 15) score += 3;
  else if (requirementsCount >= 8) score += 2;
  else if (requirementsCount >= 4) score += 1;

  // Deliverables count
  if (request.deliverables.length >= 8) score += 3;
  else if (request.deliverables.length >= 4) score += 2;
  else if (request.deliverables.length >= 2) score += 1;

  // Map score to priority level
  if (score >= 10) return PriorityLevel.CRITICAL;
  if (score >= 7) return PriorityLevel.HIGH;
  if (score >= 4) return PriorityLevel.MEDIUM;
  return PriorityLevel.LOW;
}

/**
 * Format status update for notifications or logging
 */
export function formatStatusUpdate(
  requestId: string,
  oldStatus: PresalesStatus,
  newStatus: PresalesStatus,
  updatedBy: string
): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] Presales request ${requestId} status updated from ${oldStatus} to ${newStatus} by ${updatedBy}`;
}

/**
 * Validate POC details
 */
export function validatePOCDetails(poc: Partial<POCDetails>): string[] {
  const errors: string[] = [];

  if (!poc.objectives?.length) {
    errors.push('At least one objective is required');
  }

  if (!poc.scope?.trim()) {
    errors.push('Scope is required');
  }

  if (!poc.success_criteria?.length) {
    errors.push('At least one success criterion is required');
  }

  if (!poc.environment?.trim()) {
    errors.push('Environment details are required');
  }

  if (!poc.timeline?.length) {
    errors.push('Timeline is required');
  }

  if (!poc.resources?.length) {
    errors.push('Resource allocation is required');
  }

  return errors;
}