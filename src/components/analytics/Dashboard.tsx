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
  ChartData,
  AssignmentPerformance
} from '../../services/analytics/analyticsTypes';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [sourceMetrics, setSourceMetrics] = useState<LeadSourceMetrics[]>([]);
  const [qualityDistribution, setQualityDistribution] = useState<QualificationDistribution[]>([]);
  const [assignmentMetrics, setAssignmentMetrics] = useState<AssignmentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultFilters: AnalyticsFilters = {
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
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
          qualityData,
          assignmentData
        ] = await Promise.all([
          AnalyticsService.getDashboardMetrics(defaultFilters),
          AnalyticsService.getSourceAttribution(defaultFilters),
          AnalyticsService.getQualificationDistribution(defaultFilters),
          AnalyticsService.getAssignmentPerformance(defaultFilters)
        ]);

        setMetrics(metricsData);
        setSourceMetrics(sourceData);
        setQualityDistribution(qualityData);
        setAssignmentMetrics(assignmentData);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const conversionData: ChartData = {
    labels: ['Total', 'Qualified', 'Converted'],
    datasets: [{
      label: 'Lead Conversion',
      data: [
        100,
        (metrics.qualifiedLeads / metrics.totalLeads) * 100,
        (metrics.convertedLeads / metrics.totalLeads) * 100
      ],
      backgroundColor: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))']
    }]
  };

  return (
    <div className="space-y-6">
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
        <Card className="p-6">
          <LeadConversionChart
            data={conversionData}
            title="Lead Conversion Funnel"
          />
        </Card>
        <Card className="p-6">
          <LeadSourceChart
            data={sourceMetrics}
            title="Lead Source Distribution"
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <LeadQualityTrends
            data={qualityDistribution}
            title="Lead Quality Score Distribution"
          />
        </Card>
        
        {/* Assignment Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Assignment Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Assignee</th>
                  <th className="text-right p-2">Leads</th>
                  <th className="text-right p-2">Conversions</th>
                  <th className="text-right p-2">Conversion Rate</th>
                  <th className="text-right p-2">Avg Response Time</th>
                </tr>
              </thead>
              <tbody>
                {assignmentMetrics.map((metric) => (
                  <tr key={metric.assignee} className="border-b">
                    <td className="p-2">{metric.assignee}</td>
                    <td className="text-right p-2">{metric.leadsAssigned}</td>
                    <td className="text-right p-2">{metric.conversions}</td>
                    <td className="text-right p-2">
                      {((metric.conversions / metric.leadsAssigned) * 100).toFixed(1)}%
                    </td>
                    <td className="text-right p-2">
                      {Math.round(metric.avgResponseTime / (1000 * 60))}m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;