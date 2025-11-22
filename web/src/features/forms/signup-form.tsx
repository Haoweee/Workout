import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/loading/spinner';
import { AlertMessage } from '@/components/errors/alert-message';

import { OAuth } from '@/features/forms/oauth';

import { useRegistration } from '@/context/registration-context';
import { useSendOtp } from '@/hooks/useSendOtp';

import type { RegisterRequest } from '@/types/api';

export function SignupForm({ className, ...props }: React.ComponentProps<'form'>) {
  const navigate = useNavigate();
  const { setUserData } = useRegistration();
  const { handleSendOtp, isLoading, error } = useSendOtp();

  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserData(formData);
    await handleSendOtp(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="flex w-full justify-center mb-4">
        <button className="text-xl" onClick={() => navigate('/')}>
          Workout Tracker Logo
        </button>
      </div>
      <form className={cn('flex flex-col gap-4', className)} {...props} onSubmit={handleSubmit}>
        {error && <AlertMessage message={error.message} type="error" />}
        {isLoading && <Loading />}

        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <FieldDescription className="px-6 text-center">
              Already have an account? <a href="/login">Sign in</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Field>
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
              <FieldDescription>Must be at least 8 characters.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </Field>
          </div>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <Button type="submit">Create Account</Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <OAuth />
        </FieldGroup>
      </form>
      <FieldDescription className="p-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </>
  );
}
