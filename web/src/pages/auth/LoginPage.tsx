import { LoginForm } from '@/features/forms/login-form';

export const LoginPage = () => {
  return (
    <div className="flex h-screen">
      <div className="m-auto w-[90%] md:w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};
