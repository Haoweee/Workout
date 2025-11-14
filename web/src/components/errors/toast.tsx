import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function ErrorToast({
  message,
  description,
  action,
}: {
  message: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <Button
      variant="destructive"
      onClick={() =>
        toast(message, {
          description: description,
          action: action,
        })
      }
    >
      Show Toast
    </Button>
  );
}
