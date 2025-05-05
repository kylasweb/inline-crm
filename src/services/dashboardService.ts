
import { fetchData, ApiResponse } from './api';

export interface DashboardSummary {
  newLeads: number;
  openOpportunities: number;
  pendingTickets: number;
  upcomingRenewals: number;
}

export interface RevenueStats {
  thisMonth: number;
  lastMonth: number;
  forecast: number;
  quarterly: { month: string; revenue: number }[];
}

export interface TicketStats {
  open: number;
  inProgress: number;
  pendingCustomer: number;
  resolved: number;
  priorityDistribution: { priority: string; count: number }[];
  responseTimeAvg: number;
  resolutionTimeAvg: number;
}

export interface PipelineStats {
  stages: { stage: string; count: number; value: number }[];
  winRate: number;
  averageDealSize: number;
  salesCycle: number;
}

export interface ActivityItem {
  id: number;
  type: string;
  action: string;
  subject: string;
  timestamp: string;
  user: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  revenueStats: RevenueStats;
  ticketStats: TicketStats;
  pipelineStats: PipelineStats;
  recentActivity: ActivityItem[];
}

export const dashboardService = {
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    return fetchData<DashboardData>('/dashboard');
  }
};
