import React from 'react';
import { TrendingUp } from '@/components/ui/icons';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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

export const description = 'A bar chart';

const defaultChartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
};

interface ChartBarDefaultProps {
  header?: string;
  headerIcon?: React.ComponentType<{ className?: string }>;
  headerDescription?: string;
  hasFooter?: boolean;
  chartData?: Array<{ month: string; desktop: number }>;
  chartConfig?: ChartConfig;
  className?: string;
}

export function ChartBarDefault({
  header,
  headerIcon,
  headerDescription,
  hasFooter,
  chartData,
  chartConfig = defaultChartConfig,
  className,
}: ChartBarDefaultProps) {
  const cardClassName = `${className} ${!header && !hasFooter ? 'flex flex-col' : ''}`;

  return (
    <Card className={cardClassName}>
      {header && (
        <CardHeader>
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
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {hasFooter && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
