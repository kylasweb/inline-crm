import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import type { DashboardMetrics } from '../../services/analytics/analyticsTypes';

interface LeadMetricsCardProps {
  metric: keyof DashboardMetrics;
  value: number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const LeadMetricsCard: React.FC<LeadMetricsCardProps> = ({
  metric,
  value,
  label,
  trend
}) => {
  const formatValue = (val: number): string => {
    if (metric.includes('Rate')) {
      return `${val.toFixed(1)}%`;
    }
    return val.toLocaleString();
  };

  const getTrendColor = (trend?: { value: number; isPositive: boolean }): string => {
    if (!trend) return 'bg-gray-100 text-gray-800';
    return trend.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">{label}</h3>
          {trend && (
            <Badge variant="outline" className={getTrendColor(trend)}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </Badge>
          )}
        </div>
        <div className="mt-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatValue(value)}
          </span>
        </div>
      </div>
    </Card>
  );
};