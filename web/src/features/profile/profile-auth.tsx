import { useNavigate } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import type { User } from '@/types/api';

const Apple = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
      fill="currentColor"
    />
  </svg>
);

const Google = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      fill="currentColor"
    />
  </svg>
);

export const ProfileAuth = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentication</h2>
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">Linked Accounts</h3>
            <p className="text-sm text-gray-500">Third-party accounts linked to your profile</p>
          </div>
          <div className="flex gap-2">
            {user.providers && user.providers.length > 0 ? (
              <>
                {user.providers.map((provider) => {
                  if (provider.provider === 'google') {
                    return (
                      <div className="p-2 border-2 rounded-full border-gray-200" key="google">
                        <span
                          key="google"
                          title="Google"
                          className="w-4 h-4 flex items-center justify-center text-gray-700"
                        >
                          <Google />
                        </span>
                      </div>
                    );
                  }
                  if (provider.provider === 'apple') {
                    return (
                      <div className="p-2 border-2 rounded-full border-gray-200" key="apple">
                        <span
                          key="apple"
                          title="Apple"
                          className="w-4 h-4 flex items-center justify-center text-gray-700"
                        >
                          <Apple />
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </>
            ) : (
              <p>No linked accounts</p>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">Password</h3>
            {user.providers && user.providers.length > 0 ? (
              <p className="text-sm text-gray-500">Change your password</p>
            ) : (
              <p className="text-sm text-gray-500">Set a password for your account</p>
            )}
          </div>
          <div className="flex gap-2">
            {user.providers && user.providers.length > 0 ? (
              <Button variant="outline" onClick={() => navigate('/change-password')}>
                Change Password
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/set-password')}>
                Set Password
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
