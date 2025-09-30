'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTenant } from '@/components/tenant-provider';
import { FormField } from './form-field';
import { AuthButton } from './auth-button';
import { SocialLoginButton } from './social-login-button';
import { FormSeparator } from './form-separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { tenant } = useTenant();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!credentials.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.success) {
        // Redirect to tenant dashboard or tenant selection
        if (tenant?.id) {
          router.push(`/${tenant.id}`);
        } else {
          router.push('/tenant-selection');
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid email or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement social login
      console.log(`Social login with ${provider}`);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect to tenant dashboard or tenant selection
      if (tenant?.id) {
        router.push(`/${tenant.id}`);
      } else {
        router.push('/tenant-selection');
      }
    } catch (err) {
      setError(`Failed to login with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof LoginCredentials,
    value: string | boolean
  ) => {
    setCredentials(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your petroleum management account
        </p>
      </div>

      {/* Social Login */}
      <div className="space-y-4">
        <SocialLoginButton
          provider="google"
          onClick={() => handleSocialLogin('google')}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>

      {/* Separator */}
      <FormSeparator text="or Login with Email" />

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <FormField
          label="Email"
          type="email"
          value={credentials.email}
          onChange={value => handleInputChange('email', value)}
          error={fieldErrors.email}
          required
          placeholder="Enter your email"
          autoComplete="email"
        />

        {/* Password Field */}
        <FormField
          label="Password"
          type="password"
          value={credentials.password}
          onChange={value => handleInputChange('password', value)}
          error={fieldErrors.password}
          required
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={credentials.rememberMe}
              onCheckedChange={checked =>
                handleInputChange('rememberMe', checked as boolean)
              }
            />
            <Label htmlFor="remember-me" className="text-sm text-gray-600">
              Remember me
            </Label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <AuthButton
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign in
        </AuthButton>
      </form>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
