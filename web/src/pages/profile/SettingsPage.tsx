import {
  ProfileAuth,
  ProfileEditor,
  ProfileHeader,
  ProfileDangerSettings,
  ProfilePreferences,
} from '@/features/profile';

import { useAuth } from '@/hooks/useAuth';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
