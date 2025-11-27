import { useState } from 'react';

import { AlertMessage } from '@/components/errors/alert-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useRegistration } from '@/context/registration-context';

import { useAuth, useSendOtp } from '@/hooks/auth';

import type { SendOtpRequest } from '@/types/api';

export const ChangePasswordPage: React.FC = () => {
  const { user } = useAuth();
  const { setUserData } = useRegistration();
  const { handleSendOtp, isLoading, error } = useSendOtp({ redirect: '/profile/verify-otp' });

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const formData: SendOtpRequest = {
    email: user?.email || '',
    username: user?.username || '',
    fullName: user?.fullName || '',
    password: newPassword,
    confirmPassword: confirmNewPassword,
    type: 'changePassword',
  };

  const handleSubmitChangePasswordForm = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ChangePasswordPage formData:', formData);
    setUserData(formData);
    await handleSendOtp(formData);
  };

  return (
    <div className="w-full md:max-w-[500px] mx-auto space-y-4">
      <h1 className="font-bold text-center text-xl">Change Password</h1>
      <form onSubmit={handleSubmitChangePasswordForm} className="flex flex-col gap-4">
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword ?? ''}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword ?? ''}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <Button className="w-full">{isLoading ? 'Sending OTP...' : 'Change Password'}</Button>
      </form>

      {error && <AlertMessage message={error.message} type="error" />}
    </div>
  );
};
