import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { AlertMessage } from '@/components/errors/alert-message';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { OAuth } from '@/features/forms/oauth';

import { useLogin } from '@/hooks/auth';

import type { LoginRequest } from '@/types/api';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const navigate = useNavigate();
  const { handleLogin, isLoading, error } = useLogin();

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(formData);
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
      <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <FieldDescription>
              Don&apos;t have an account? <a href="/signup">Sign up</a>
            </FieldDescription>
          </div>

          {error && <AlertMessage type="error" message={error.message} />}

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
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 text-muted-foreground hover:underline"
              >
                <i>Forgot your password?</i>
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <OAuth />
        </FieldGroup>
      </form>
      <FieldDescription className="p-6 text-center">
        By clicking continue, you agree to our{' '}
        <Link to="/legal?tab=terms-of-service">Terms of Service</Link> and{' '}
        <Link to="/legal?tab=privacy-policy">Privacy Policy</Link>.
      </FieldDescription>
    </>
  );
}
