import React from 'react';
import { Card } from '../ui/card';
import { ChartContainer } from '../ui/chart';
import * as RechartsPrimitive from 'recharts';
import type { ChartData } from '../../services/analytics/analyticsTypes';

interface LeadConversionChartProps {
  data: ChartData;
  title: string;
  className?: string;
}

export const LeadConversionChart: React.FC<LeadConversionChartProps> = ({
  data,
  title,
  className = ''
}) => {
  const chartConfig = {
    conversion: {
      label: 'Conversion Rate',
      theme: {
        light: 'hsl(var(--primary))',
        dark: 'hsl(var(--primary))'
      }
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <RechartsPrimitive.BarChart data={data.datasets[0].data}>
            <RechartsPrimitive.XAxis 
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />
            <RechartsPrimitive.YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <RechartsPrimitive.Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              fill="var(--color-conversion)"
            />
            <RechartsPrimitive.Tooltip />
            <RechartsPrimitive.Legend />
          </RechartsPrimitive.BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
};