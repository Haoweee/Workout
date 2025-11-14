import React from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

export const description = 'A radar chart';

const defaultChartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
};

interface ChartRadarDefaultProps {
  header?: string;
  headerIcon?: React.ComponentType<{ className?: string }>;
  headerDescription?: string;
  hasFooter?: boolean;
  chartData?: Array<{ month: string; desktop: number }>;
  chartConfig?: ChartConfig;
  className?: string;
}

export function ChartRadarDefault({
  header,
  headerIcon,
  headerDescription,
  hasFooter = true,
  chartData,
  chartConfig = defaultChartConfig,
  className = '',
}: ChartRadarDefaultProps) {
  const cardClassName = `${className} ${!header && !hasFooter ? 'flex flex-col' : ''}`;

  return (
    <Card className={cardClassName}>
      {header && (
        <CardHeader className="items-center pb-4">
          <CardTitle className="flex items-center">
            {headerIcon &&
              React.createElement(headerIcon, {
                className: 'h-5 w-5 mr-2 text-green-600',
              })}
            {header}
          </CardTitle>
          <CardDescription>{headerDescription}</CardDescription>
        </CardHeader>
      )}
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {hasFooter && (
        <CardFooter className="flex-col gap-2 text-xs">
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            <i>Note: custom exercises may not be included</i>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
