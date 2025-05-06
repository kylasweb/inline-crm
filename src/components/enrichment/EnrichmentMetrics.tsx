import { Card } from '@/components/ui/card';
import { LeadEnrichmentData } from '@/services/enrichment/enrichmentTypes';

interface EnrichmentMetricsProps {
  data: LeadEnrichmentData[];
}

export function EnrichmentMetrics({ data }: EnrichmentMetricsProps) {
  // In real implementation, these would be calculated from actual data
  const metrics = {
    totalEnrichments: 1250,
    successRate: 94.5,
    averageFieldsEnriched: 3.8,
    providerStats: {
      'Company Data': { success: 95, total: 100 },
      'Contact Info': { success: 88, total: 100 },
      'Social Media': { success: 92, total: 100 },
      'Technology': { success: 85, total: 100 }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="text-sm font-medium text-gray-500">Total Enrichments</div>
        <div className="mt-2 text-3xl font-bold">{metrics.totalEnrichments}</div>
        <div className="text-xs text-gray-400">Last 30 days</div>
      </Card>

      <Card className="p-4">
        <div className="text-sm font-medium text-gray-500">Success Rate</div>
        <div className="mt-2 text-3xl font-bold">{metrics.successRate}%</div>
        <div className="text-xs text-gray-400">Overall completion rate</div>
      </Card>

      <Card className="p-4">
        <div className="text-sm font-medium text-gray-500">Avg. Fields Enriched</div>
        <div className="mt-2 text-3xl font-bold">{metrics.averageFieldsEnriched}</div>
        <div className="text-xs text-gray-400">Per successful enrichment</div>
      </Card>

      <Card className="p-4">
        <div className="text-sm font-medium text-gray-500">Provider Success</div>
        <div className="mt-2 space-y-1">
          {Object.entries(metrics.providerStats).map(([provider, stats]) => (
            <div key={provider} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{provider}</span>
              <span className="font-medium">
                {Math.round((stats.success / stats.total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}