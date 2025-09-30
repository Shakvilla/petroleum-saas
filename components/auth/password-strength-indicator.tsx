'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({
  password,
  minLength = 8,
  requireUppercase = true,
  requireLowercase = true,
  requireNumbers = true,
  requireSpecialChars = true,
}) => {
  const requirements: PasswordRequirement[] = [
    {
      label: `At least ${minLength} characters`,
      test: pwd => pwd.length >= minLength,
      met: password.length >= minLength,
    },
    {
      label: 'Contains uppercase letter',
      test: pwd => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password),
    },
    {
      label: 'Contains lowercase letter',
      test: pwd => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password),
    },
    {
      label: 'Contains number',
      test: pwd => /\d/.test(pwd),
      met: /\d/.test(password),
    },
    {
      label: 'Contains special character',
      test: pwd => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const metRequirements = requirements.filter(req => req.met).length;
  const strengthPercentage = (metRequirements / requirements.length) * 100;

  const getStrengthColor = (percentage: number) => {
    if (percentage < 40) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (percentage: number) => {
    if (percentage < 40) return 'Weak';
    if (percentage < 70) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Password strength</span>
          <span
            className={cn(
              'font-medium',
              strengthPercentage < 40
                ? 'text-red-600'
                : strengthPercentage < 70
                  ? 'text-yellow-600'
                  : 'text-green-600'
            )}
          >
            {getStrengthText(strengthPercentage)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              getStrengthColor(strengthPercentage)
            )}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-center space-x-2">
            {requirement.met ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}
            <span
              className={cn(
                'text-sm',
                requirement.met ? 'text-green-600' : 'text-gray-500'
              )}
            >
              {requirement.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
