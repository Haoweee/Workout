import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AvatarProfile } from '@/components/profile/avatar';
import type { Routine } from '@/types/api';

export const RoutineHeader = ({
  routine,
  showAvatar = false,
  navigation,
}: {
  routine?: Routine;
  showAvatar?: boolean;
  navigation?: string;
}) => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          if (navigation) {
            navigate(navigation);
          }
        }}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Routines
      </Button>

      {showAvatar && routine && (
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{routine.title}</h1>
          <AvatarProfile
            avatarUrl={routine.author.avatarUrl}
            userName={routine.author.username}
            fullName={routine.author.fullName}
            showName={true}
          />
        </div>
      )}
    </>
  );
};
