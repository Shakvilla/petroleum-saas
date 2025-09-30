'use client';

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load authentication components
export const LazyLoginPage = lazy(() => import('./login-page'));

export const LazyRegisterPage = lazy(() => import('./register-page'));

export const LazyForgotPasswordPage = lazy(
  () => import('./forgot-password-page')
);

export const LazyVisualMarketingSection = lazy(
  () => import('./visual-marketing-section')
);

// Loading component for authentication pages
export const AuthLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

// Wrapper component for lazy-loaded auth pages
export const LazyAuthWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={<AuthLoadingSpinner />}>{children}</Suspense>;
