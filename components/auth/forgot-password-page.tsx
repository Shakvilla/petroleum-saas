'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormField } from './form-field';
import { AuthButton } from './auth-button';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import { CheckCircle, ArrowLeft } from 'lucide-react';

interface PasswordResetData {
  email: string;
  password: string;
  confirmPassword: string;
}

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState<'email' | 'reset' | 'success'>(
    token ? 'reset' : 'email'
  );
  const [formData, setFormData] = useState<PasswordResetData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateEmailForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateResetForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(
        formData.password
      )
    ) {
      errors.password =
        'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Sending reset email to:', formData.email);
      setStep('success');
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateResetForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Resetting password with token:', token);
      setStep('success');
    } catch (err) {
      setError(
        'Failed to reset password. The link may have expired. Please request a new one.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PasswordResetData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleResendEmail = () => {
    setStep('email');
    setError(null);
  };

  // Success State
  if (step === 'success') {
    return (
      <div className="space-y-8 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {token ? 'Password Reset Successful' : 'Check Your Email'}
          </h1>

          <p className="text-gray-600">
            {token
              ? 'Your password has been successfully reset. You can now sign in with your new password.'
              : "We've sent a password reset link to your email address. Please check your inbox and follow the instructions."}
          </p>
        </div>

        <div className="space-y-4">
          {token ? (
            <AuthButton
              onClick={() => router.push('/auth/login')}
              variant="primary"
              size="lg"
            >
              Sign In
            </AuthButton>
          ) : (
            <div className="space-y-3">
              <AuthButton
                onClick={handleResendEmail}
                variant="secondary"
                size="lg"
              >
                Resend Email
              </AuthButton>
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Email Input Step
  if (step === 'email') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSendResetEmail} className="space-y-6">
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
            value={formData.email}
            onChange={value => handleInputChange('email', value)}
            error={fieldErrors.email}
            required
            placeholder="Enter your email address"
            autoComplete="email"
          />

          {/* Send Reset Email Button */}
          <AuthButton
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Send Reset Link
          </AuthButton>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Password Reset Step
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below.
        </p>
      </div>

      {/* Reset Form */}
      <form onSubmit={handleResetPassword} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Password Field */}
        <div className="space-y-2">
          <FormField
            label="New Password"
            type="password"
            value={formData.password}
            onChange={value => handleInputChange('password', value)}
            error={fieldErrors.password}
            required
            placeholder="Enter your new password"
            autoComplete="new-password"
          />
          {formData.password && (
            <PasswordStrengthIndicator password={formData.password} />
          )}
        </div>

        {/* Confirm Password Field */}
        <FormField
          label="Confirm New Password"
          type="password"
          value={formData.confirmPassword}
          onChange={value => handleInputChange('confirmPassword', value)}
          error={fieldErrors.confirmPassword}
          required
          placeholder="Confirm your new password"
          autoComplete="new-password"
        />

        {/* Reset Password Button */}
        <AuthButton
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Reset Password
        </AuthButton>
      </form>

      {/* Back to Login */}
      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
