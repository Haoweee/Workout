import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const AlertMessage = ({ message }: { message: string; type: 'error' | 'success' }) => {
  return (
    <Alert className="border border-red-500 text-red-600 bg-red-200">
      <AlertTitle>
        <div className="flex flex-row items-center ">
          <AlertCircleIcon className="mr-2" />
          <span>Error</span>
        </div>
      </AlertTitle>
      <AlertDescription className="text-red-600">{message}</AlertDescription>
    </Alert>
  );
};
