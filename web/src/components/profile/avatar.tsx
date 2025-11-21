import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarUrl } from '@/constants';

export const AvatarProfile = (user: {
  avatarUrl?: string | null;
  userName?: string;
  fullName: string;
  email?: string;
  showName?: boolean;
  className?: string;
}) => {
  console.log('AvatarProfile user picture:', getAvatarUrl(user.avatarUrl));
  return (
    <div className="flex flex-row items-center gap-2">
      <Avatar className={`h-8 w-8 ${user.className}`}>
        <AvatarImage
          src={getAvatarUrl(user.avatarUrl)}
          alt={`@${user.userName || user.fullName}'s avatar`}
          className="h-8 w-8 rounded-full object-cover"
        />
        <AvatarFallback className="bg-gray-200 h-8 w-8 text-sm font-semibold flex items-center justify-center">
          {user.fullName
            ?.split(' ')
            .map((name) => name[0])
            .join('')
            .toUpperCase() ||
            user.email?.[0]?.toUpperCase() ||
            'U'}
        </AvatarFallback>
      </Avatar>
      {user.showName && (
        <span className="text-sm font-medium leading-none">{user.userName || user.fullName}</span>
      )}
    </div>
  );
};
