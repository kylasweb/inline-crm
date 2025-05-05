import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { LeadMetricsCard } from './LeadMetricsCard';
import { LeadConversionChart } from './LeadConversionChart';
import { LeadSourceChart } from './LeadSourceChart';
import { LeadQualityTrends } from './LeadQualityTrends';
import { AnalyticsService } from '../../services/analytics/analyticsService';
import type { 
  DashboardMetrics,
  AnalyticsFilters,
  LeadSourceMetrics,
  QualificationDistribution,
  ChartData
} from '../../services/analytics/analyticsTypes';

export const LeadAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [sourceMetrics, setSourceMetrics] = useState<LeadSourceMetrics[]>([]);
  const [qualityDistribution, setQualityDistribution] = useState<QualificationDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultFilters: AnalyticsFilters = {
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      end: new Date()
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          metricsData,
          sourceData,
          qualityData
        ] = await Promise.all([
          AnalyticsService.getDashboardMetrics(defaultFilters),
          AnalyticsService.getSourceAttribution(defaultFilters),
          AnalyticsService.getQualificationDistribution(defaultFilters)
        ]);

        setMetrics(metricsData);
        setSourceMetrics(sourceData);
        setQualityDistribution(qualityData);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const conversionData: ChartData = {
    labels: ['Total', 'Qualified', 'Converted'],
    datasets: [{
      label: 'Lead Conversion',
      data: metrics ? [
        100,
        (metrics.qualifiedLeads / metrics.totalLeads) * 100,
        (metrics.convertedLeads / metrics.totalLeads) * 100
      ] : [],
      backgroundColor: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))']
    }]
  };

  if (loading || !metrics) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            Loading analytics data...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LeadMetricsCard
          metric="totalLeads"
          value={metrics.totalLeads}
          label="Total Leads"
        />
        <LeadMetricsCard
          metric="qualifiedLeads"
          value={metrics.qualifiedLeads}
          label="Qualified Leads"
          trend={{
            value: (metrics.qualifiedLeads / metrics.totalLeads) * 100,
            isPositive: true
          }}
        />
        <LeadMetricsCard
          metric="convertedLeads"
          value={metrics.convertedLeads}
          label="Converted Leads"
          trend={{
            value: metrics.conversionRate,
            isPositive: metrics.conversionRate > 20
          }}
        />
        <LeadMetricsCard
          metric="averageQualityScore"
          value={metrics.averageQualityScore}
          label="Avg Quality Score"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadConversionChart
          data={conversionData}
          title="Lead Conversion Funnel"
        />
        <LeadSourceChart
          data={sourceMetrics}
          title="Lead Source Distribution"
        />
      </div>

      <div className="grid grid-cols-1">
        <LeadQualityTrends
          data={qualityDistribution}
          title="Lead Quality Score Distribution"
        />
      </div>
    </div>
  );
};