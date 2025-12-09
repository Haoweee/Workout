import React from 'react';
import { TrendingUpIcon } from '@/components/ui/icons';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

// export const description = 'A line chart';

// const chartData = [
//   { month: 'January', desktop: 186 },
//   { month: 'February', desktop: 305 },
//   { month: 'March', desktop: 237 },
//   { month: 'April', desktop: 73 },
//   { month: 'May', desktop: 209 },
//   { month: 'June', desktop: 214 },
// ];

// const chartConfig = {
//   desktop: {
//     label: 'Desktop',
//     color: 'var(--chart-1)',
//   },
// } satisfies ChartConfig;

interface ChartLineDefaultProps {
  header?: string;
  headerIcon?: React.ComponentType<{ className?: string }>;
  headerDescription?: string;
  hasFooter?: boolean;
  chartData?: Array<{ month: string; desktop: number }>;
  chartConfig?: ChartConfig;
  className?: string;
}

// Provide a default chartConfig to avoid undefined
const defaultChartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
};

export function ChartLineDefault({
  header,
  headerIcon,
  headerDescription,
  hasFooter = true,
  chartData,
  chartConfig = defaultChartConfig,
  className = '',
}: ChartLineDefaultProps) {
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
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <ChartContainer config={chartConfig} className="w-full h-full max-w-full max-h-72">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 5,
                left: 8,
                right: 8,
                bottom: 5,
              }}
              width={undefined}
              height={undefined}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => value}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Line
                dataKey="desktop"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
      {hasFooter && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUpIcon className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
