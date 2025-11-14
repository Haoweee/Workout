import { AvatarProfile } from '@/components/profile/avatar';
import type { User } from '@/types/api';

export const ProfileHeader: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="flex flex-row items-center gap-4">
      {user && (
        <AvatarProfile avatarUrl={user.avatarUrl} fullName={user.fullName} email={user.email} />
      )}

      <div className="flex flex-col max-w-[400px] gap-2">
        <p className="text-xl font-semibold text-gray-900">{user?.username || 'Not provided'}</p>
        <p className="text-sm text-gray-500">{user?.bio || 'No bio available'}</p>
      </div>
    </div>
  );
};
