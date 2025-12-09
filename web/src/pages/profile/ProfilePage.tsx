import Loading from '@/components/loading/spinner';

import { ProfileHeader, ProfileEditor, ProfileContent } from '@/features/profile';

import { useAuth } from '@/hooks/auth';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 max-w-[95%] mx-auto">
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center">
          <ProfileHeader user={user} />
          <ProfileEditor user={user} />
        </div>
        <ProfileContent />
      </div>
    </div>
  );
};

export default ProfilePage;
