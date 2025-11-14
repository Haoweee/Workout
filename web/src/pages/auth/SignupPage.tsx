import { SignupForm } from '@/features/forms/signup-form';

export const SignupPage = () => {
  return (
    <div className="flex h-screen">
      <div className="m-auto w-[90%] md:w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
};
