export interface DashboardMetrics {
  totalLeads: number;
  convertedLeads: number;
  qualifiedLeads: number;
  averageQualityScore: number;
  conversionRate: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface LeadSourceMetrics {
  source: string;
  count: number;
  conversionRate: number;
  qualityScore: number;
}

export interface QualificationDistribution {
  score: number;
  count: number;
  percentage: number;
}

export interface AssignmentPerformance {
  assignee: string;
  leadsAssigned: number;
  conversions: number;
  avgResponseTime: number;
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  sources?: string[];
  assignees?: string[];
  qualificationThreshold?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
  }[];
}

export interface ReportConfig {
  title: string;
  description: string;
  metrics: string[];
  filters: AnalyticsFilters;
  chartType: 'line' | 'bar' | 'pie' | 'doughnut';
}