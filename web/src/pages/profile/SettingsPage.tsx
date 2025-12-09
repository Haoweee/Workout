import Loading from '@/components/loading/spinner';

import {
  ProfileAuth,
  ProfileEditor,
  ProfileHeader,
  ProfileDangerSettings,
  ProfilePreferences,
} from '@/features/profile';

import { useAuth } from '@/hooks/auth';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 max-w-[95%] mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center">
          <ProfileHeader user={user} />
          <ProfileEditor user={user} />
        </div>
      </div>

      <ProfileAuth user={user} />
      <ProfilePreferences />
      <ProfileDangerSettings />
    </div>
  );
};

export default SettingsPage;
