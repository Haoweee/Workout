import { useNavigate } from 'react-router-dom';

import { ArrowLeft } from 'lucide-react';

import { AvatarProfile } from '@/components/profile/avatar';
import { Button } from '@/components/ui/button';

import type { RoutineHeaderProps } from '@/types/routine';

export const RoutineHeader: React.FC<RoutineHeaderProps> = ({
  routine,
  showAvatar = false,
  navigation,
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
