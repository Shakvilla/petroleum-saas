'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTenant } from '@/components/tenant-provider';
import { FormField } from './form-field';
import { AuthButton } from './auth-button';
import { SocialLoginButton } from './social-login-button';
import { FormSeparator } from './form-separator';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import { cn } from '@/lib/utils';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  agreeToTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { tenant } = useTenant();
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

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

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
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
      // TODO: Replace with actual registration API call
      // Issue: #AUTH-REGISTER-001
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful registration
      console.log('Registration data:', formData);

      // Redirect to login page with success message
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement social signup
      // Issue: #AUTH-SOCIAL-SIGNUP-001
      console.log(`Social signup with ${provider}`);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect to tenant dashboard or tenant selection
      if (tenant) {
        router.push(`/${tenant}`);
      } else {
        router.push('/tenant-selection');
      }
    } catch (err) {
      setError(`Failed to sign up with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof RegistrationData,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Get started with your petroleum management platform
        </p>
      </div>

      {/* Social Signup */}
      <div className="space-y-4">
        <SocialLoginButton
          provider="google"
          onClick={() => handleSocialSignup('google')}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>

      {/* Separator */}
      <FormSeparator text="or Sign up with Email" />

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            value={formData.firstName}
            onChange={value => handleInputChange('firstName', value)}
            error={fieldErrors.firstName}
            required
            placeholder="John"
            autoComplete="given-name"
          />
          <FormField
            label="Last Name"
            value={formData.lastName}
            onChange={value => handleInputChange('lastName', value)}
            error={fieldErrors.lastName}
            required
            placeholder="Doe"
            autoComplete="family-name"
          />
        </div>

        {/* Email Field */}
        <FormField
          label="Email"
          type="email"
          value={formData.email}
          onChange={value => handleInputChange('email', value)}
          error={fieldErrors.email}
          required
          placeholder="john@company.com"
          autoComplete="email"
        />

        {/* Company Name Field */}
        <FormField
          label="Company Name"
          value={formData.companyName}
          onChange={value => handleInputChange('companyName', value)}
          error={fieldErrors.companyName}
          required
          placeholder="Your Company Ltd."
          autoComplete="organization"
        />

        {/* Password Field */}
        <div className="space-y-2">
          <FormField
            label="Password"
            type="password"
            value={formData.password}
            onChange={value => handleInputChange('password', value)}
            error={fieldErrors.password}
            required
            placeholder="Create a strong password"
            autoComplete="new-password"
          />
          {formData.password && (
            <PasswordStrengthIndicator password={formData.password} />
          )}
        </div>

        {/* Confirm Password Field */}
        <FormField
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={value => handleInputChange('confirmPassword', value)}
          error={fieldErrors.confirmPassword}
          required
          placeholder="Confirm your password"
          autoComplete="new-password"
        />

        {/* Terms and Conditions */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="agree-terms"
              checked={formData.agreeToTerms}
              onChange={e =>
                handleInputChange('agreeToTerms', e.target.checked)
              }
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="text-sm text-gray-600">
              I agree to the{' '}
              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-500 underline"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-500 underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {fieldErrors.agreeToTerms && (
            <p className="text-sm text-red-600" role="alert">
              {fieldErrors.agreeToTerms}
            </p>
          )}
        </div>

        {/* Sign Up Button */}
        <AuthButton
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Create account
        </AuthButton>
      </form>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
