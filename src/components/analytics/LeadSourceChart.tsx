import React from 'react';
import { Card } from '../ui/card';
import { ChartContainer } from '../ui/chart';
import * as RechartsPrimitive from 'recharts';
import type { LeadSourceMetrics } from '../../services/analytics/analyticsTypes';

interface LeadSourceChartProps {
  data: LeadSourceMetrics[];
  title: string;
  className?: string;
}

export const LeadSourceChart: React.FC<LeadSourceChartProps> = ({
  data,
  title,
  className = ''
}) => {
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    '#22c55e',
    '#eab308',
    '#f97316'
  ];

  const chartConfig = data.reduce((acc, source, index) => ({
    ...acc,
    [source.source]: {
      label: source.source,
      theme: {
        light: colors[index % colors.length],
        dark: colors[index % colors.length]
      }
    }
  }), {});

  const formattedData = data.map(item => ({
    name: item.source,
    value: item.count
  }));

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <RechartsPrimitive.PieChart>
            <RechartsPrimitive.Pie
              data={formattedData}
              nameKey="name"
              dataKey="value"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={2}
            >
              {formattedData.map((entry, index) => (
                <RechartsPrimitive.Cell
                  key={entry.name}
                  fill={`var(--color-${entry.name})`}
                  stroke="transparent"
                />
              ))}
            </RechartsPrimitive.Pie>
            <RechartsPrimitive.Tooltip />
            <RechartsPrimitive.Legend />
          </RechartsPrimitive.PieChart>
        </ChartContainer>
      </div>
    </Card>
  );
};