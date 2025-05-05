import { fetchData, type Lead } from '../api';
import type * as Types from './analyticsTypes';

export class AnalyticsService {
  private static async fetchLeadData(filters: Types.AnalyticsFilters): Promise<Lead[]> {
    const response = await fetchData<Lead[]>('/leads');
    return response.data || [];
  }

  static async getDashboardMetrics(filters: Types.AnalyticsFilters): Promise<Types.DashboardMetrics> {
    const leads = await this.fetchLeadData(filters);
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
    const qualifiedLeads = leads.filter(lead => lead.score >= 70).length;
    
    return {
      totalLeads,
      convertedLeads,
      qualifiedLeads,
      averageQualityScore: this.calculateAverageScore(leads),
      conversionRate: (convertedLeads / totalLeads) * 100
    };
  }

  static async getLeadVolumeTrends(filters: Types.AnalyticsFilters): Promise<Types.TimeSeriesData[]> {
    const leads = await this.fetchLeadData(filters);
    return this.aggregateTimeSeriesData(leads, 'createdAt');
  }

  static async getSourceAttribution(filters: Types.AnalyticsFilters): Promise<Types.LeadSourceMetrics[]> {
    const leads = await this.fetchLeadData(filters);
    const sourceMetrics = new Map<string, Types.LeadSourceMetrics>();

    leads.forEach(lead => {
      const source = lead.source || 'unknown';
      const current = sourceMetrics.get(source) || {
        source,
        count: 0,
        conversionRate: 0,
        qualityScore: 0
      };

      current.count++;
      current.qualityScore += lead.score || 0;
      if (lead.status === 'converted') {
        current.conversionRate++;
      }

      sourceMetrics.set(source, current);
    });

    return Array.from(sourceMetrics.values()).map(metric => ({
      ...metric,
      qualityScore: metric.qualityScore / metric.count,
      conversionRate: (metric.conversionRate / metric.count) * 100
    }));
  }

  static async getQualificationDistribution(filters: Types.AnalyticsFilters): Promise<Types.QualificationDistribution[]> {
    const leads = await this.fetchLeadData(filters);
    const distribution = new Map<number, number>();
    
    leads.forEach(lead => {
      const score = Math.floor(lead.score / 10) * 10;
      distribution.set(score, (distribution.get(score) || 0) + 1);
    });

    const total = leads.length;
    return Array.from(distribution.entries())
      .map(([score, count]) => ({
        score,
        count,
        percentage: (count / total) * 100
      }))
      .sort((a, b) => a.score - b.score);
  }

  static async getAssignmentPerformance(filters: Types.AnalyticsFilters): Promise<Types.AssignmentPerformance[]> {
    const leads = await this.fetchLeadData(filters);
    const performance = new Map<string, Types.AssignmentPerformance>();

    leads.forEach(lead => {
      if (!lead.assignedTo) return;

      const current = performance.get(lead.assignedTo) || {
        assignee: lead.assignedTo,
        leadsAssigned: 0,
        conversions: 0,
        avgResponseTime: 0
      };

      current.leadsAssigned++;
      if (lead.status === 'converted') {
        current.conversions++;
      }
      if (lead.lastContact && lead.createdAt) {
        const responseTime = new Date(lead.lastContact).getTime() - new Date(lead.createdAt).getTime();
        current.avgResponseTime = ((current.avgResponseTime * (current.leadsAssigned - 1)) + responseTime) / current.leadsAssigned;
      }

      performance.set(lead.assignedTo, current);
    });

    return Array.from(performance.values());
  }

  static async generateForecast(historicalData: Types.TimeSeriesData[]): Promise<Types.TimeSeriesData[]> {
    // Simple moving average forecast
    const windowSize = 7;
    const forecast: Types.TimeSeriesData[] = [];
    const values = historicalData.map(d => d.value);
    
    for (let i = windowSize; i < values.length; i++) {
      const window = values.slice(i - windowSize, i);
      const average = window.reduce((sum, val) => sum + val, 0) / windowSize;
      const date = new Date(historicalData[i].timestamp);
      date.setDate(date.getDate() + 1);
      
      forecast.push({
        timestamp: date.toISOString(),
        value: average
      });
    }

    return forecast;
  }

  static async exportReport(config: Types.ReportConfig): Promise<Blob> {
    const metrics = await this.getDashboardMetrics(config.filters);
    const data = {
      title: config.title,
      description: config.description,
      generatedAt: new Date().toISOString(),
      metrics,
      filters: config.filters
    };

    return new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
  }

  private static calculateAverageScore(leads: Lead[]): number {
    const scores = leads.map(lead => lead.score || 0);
    return scores.reduce((sum, score) => sum + score, 0) / leads.length;
  }

  private static aggregateTimeSeriesData(leads: Lead[], dateField: keyof Lead): Types.TimeSeriesData[] {
    const dailyData = new Map<string, number>();

    leads.forEach(lead => {
      const date = new Date(lead[dateField] as string).toISOString().split('T')[0];
      dailyData.set(date, (dailyData.get(date) || 0) + 1);
    });

    return Array.from(dailyData.entries())
      .map(([date, value]) => ({
        timestamp: date,
        value
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
}