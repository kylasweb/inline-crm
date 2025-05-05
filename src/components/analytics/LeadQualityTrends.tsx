import React from 'react';
import { Card } from '../ui/card';
import { ChartContainer } from '../ui/chart';
import * as RechartsPrimitive from 'recharts';
import type { QualificationDistribution } from '../../services/analytics/analyticsTypes';

interface LeadQualityTrendsProps {
  data: QualificationDistribution[];
  title: string;
  className?: string;
}

export const LeadQualityTrends: React.FC<LeadQualityTrendsProps> = ({
  data,
  title,
  className = ''
}) => {
  const chartConfig = {
    quality: {
      label: 'Quality Score',
      theme: {
        light: 'hsl(var(--primary))',
        dark: 'hsl(var(--primary))'
      }
    },
    percentage: {
      label: 'Distribution %',
      theme: {
        light: 'hsl(var(--secondary))',
        dark: 'hsl(var(--secondary))'
      }
    }
  };

  const formattedData = data.map(item => ({
    score: `${item.score}+`,
    quality: item.score,
    percentage: item.percentage
  }));

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <RechartsPrimitive.LineChart data={formattedData}>
            <RechartsPrimitive.XAxis 
              dataKey="score"
              tickLine={false}
              axisLine={false}
            />
            <RechartsPrimitive.YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
            />
            <RechartsPrimitive.YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              label={{ value: 'Distribution %', angle: 90, position: 'insideRight' }}
            />
            <RechartsPrimitive.Line
              yAxisId="left"
              type="monotone"
              dataKey="quality"
              stroke="var(--color-quality)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-quality)' }}
            />
            <RechartsPrimitive.Line
              yAxisId="right"
              type="monotone"
              dataKey="percentage"
              stroke="var(--color-percentage)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-percentage)' }}
            />
            <RechartsPrimitive.Tooltip />
            <RechartsPrimitive.Legend />
          </RechartsPrimitive.LineChart>
        </ChartContainer>
      </div>
    </Card>
  );
};