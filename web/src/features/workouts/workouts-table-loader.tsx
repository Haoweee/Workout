import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const WorkoutTableSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 max-w-[95%] mx-auto">
      <div className="max-w-6xl mx-auto">
        <Card className="h-full flex flex-col p-6">
          <CardHeader className="p-0 flex flex-col md:flex-row justify-between">
            <div className="flex flex-col gap-2">
              <div className="leading-none font-semibold flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex flex-row gap-2 md:gap-3 w-full md:w-auto mt-2 md:items-center md:mt-0">
              <Skeleton className="h-9 w-32 flex-1" />
              <Skeleton className="h-9 w-24 flex-1" />
            </div>
          </CardHeader>

          <div className="flex-1 mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <Skeleton className="h-4 w-12" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(8)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};
